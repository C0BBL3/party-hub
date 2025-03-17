const config = require('../../config/' + global.nodeEnv);
const AnomalyService = require('../services/anomaly-service');

class APIAnomalyDetector {
    constructor() { 
        this.internalServerErrorReturn = {
            isAuthenticated: false,
            error: { code: 500, message: "Internal server error." }
        };

        this.anomalyDetectedReturn = {
            anomalyDetected: true,
            error: { code: 400, message: "Bad Request." }
        };

        this.anomalyNotDetectedReturn = {
            anomalyDetected: false,
            error: null
        };
    }

    async write(apiPublicKey, request, refused = 0, message = '', code = 200) {
        try {
            await AnomalyService.write(apiPublicKey, request, refused, message, String(code));
        } catch (e) {
            return this.internalServerErrorReturn;
        }
    }

    async inspectKey(apiPublicKey, method) {
        try {
            const strikes = await AnomalyService.getStrikesOnKey(apiPublicKey);

            if (strikes >= config.api.strikes) {
                return this.anomalyDetectedReturn;
            }

            const lastRequest = await AnomalyService.getLastRequest(apiPublicKey);

            if (lastRequest) {
                const diff = this.getTimeDifferenceInSeconds(lastRequest.created);

                if (diff < config.api.cooldownPeriod) {
                    return this.anomalyDetectedReturn;
                }
            }

            if (!config.api.allowedMethods.includes(method)) {
                return this.anomalyDetectedReturn;
            }
            
            return this.anomalyNotDetectedReturn;
        } catch (e) {
            return this.internalServerErrorReturn;
        }
    }

    getTimeDifference(timestamp) {
        const now = Date.now();
        const givenTime = new Date(timestamp).getTime();
        return now - givenTime;
    }
}

module.exports = APIAnomalyDetector;