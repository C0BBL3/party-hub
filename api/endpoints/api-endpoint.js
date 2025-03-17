const APIAnomalyDetector = require("../lib/api-anomaly-detector");
const APISecurity = require("../lib/api-security");

class APIEndPoint {
    constructor() {
        this.internalServerErrorReturn = {
            result: false,
            error: { code: 500, message: "Internal server error." }
        };
    }

    async processRequest(req, res) { }

    async sendResponse(req, res, json, code = 200) {
        const security = new APISecurity();

        const apiPublicKey_ = req.get("Public-API-Key");
        const apiPublicKey = security.sanitizeInput(apiPublicKey_);

        const request = {
            method: security.sanitizeInput(req.method),
            URL: security.sanitizeInput(req.originalUrl),
            headers: security.sanitizeInput(JSON.stringify(security.sanitizeObject(req.headers))),
            body: req.body ? security.sanitizeInput(JSON.stringify(security.sanitizeObject(req.body))) : ""
        };

        const anomaly = new APIAnomalyDetector();
            
        if (code === 200) {
            await anomaly.write(apiPublicKey, request);
        } else {
            await anomaly.write(apiPublicKey, request, 1, json.error.message, code);
        }

        res.setHeader('Access-Control-Allow-Credentials', 'omit');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(code).send(json);
    }

    getDummyBody() { }

    getDummyData() { }
}

module.exports = APIEndPoint;