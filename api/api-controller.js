const APIEndPoint = require('./endpoints/api-endpoint');
const APIGetHost = require('./endpoints/host/api-get-host');
const APIGetFeaturedParties = require('./endpoints/party/api-get-featured-parties');
const APIGetParty = require('./endpoints/party/api-get-party');
const APIPostParty = require('./endpoints/party/api-post-party');
const APIUpdateParty = require('./endpoints/party/api-update-party');
const APIGetPatron = require('./endpoints/patron/api-get-patron');
const APIAnomalyDetector = require('./lib/api-anomaly-detector');
const APIAuthenticator = require('./lib/api-authenticator');
const APISecurity = require('./lib/api-security');
const APIValidator = require('./lib/api-validator');

class APIController {
    static async inspectRequest(req, res, next) {
        if (global.nodeEnv !== 'development' && req.protocol !== 'https') { // Never accepting non-HTTPS requests on live server
            console.log(req.protocol);
            const endpoint = new APIEndPoint();
            return endpoint.sendResponse(req, res, { code: 403, message: 'Forbidden' }, 403);
        }

        const security = new APISecurity();

        const URL = req.originalUrl;
        const URLScanResult = security.detectMaliciousParameter(URL);

        if (!URLScanResult.isCleared) {
            const endpoint = new APIEndPoint();
            return endpoint.sendResponse(req, res, URLScanResult.error, URLScanResult.error.code);    
        }

        const headers = req.headers;
        const headerScanResult = security.detectMaliciousAttack(headers);
        
        if (!headerScanResult.isCleared) {
            const endpoint = new APIEndPoint();
            return endpoint.sendResponse(req, res, headerScanResult.error, headerScanResult.error.code);
        }

        if (req.method === 'POST') {
            const body = req.headers;
            const bodyScanResult = security.detectMaliciousAttack(body);
        
            if (!bodyScanResult.isCleared) {
                const endpoint = new APIEndPoint();
                return endpoint.sendResponse(req, res, bodyScanResult.error, bodyScanResult.error.code);
            }
        }
        
        next();
        return;
    }

    static async scanForAnomaly(req, res, next) {
        const publicKey = req.get("Public-API-Key");
        const method = req.method;

        const anomaly = new APIAnomalyDetector();
        const anomalyDetectionResult = await anomaly.inspectKey(publicKey, method);

        if (anomalyDetectionResult.anomalyDetected) {
            const endpoint = new APIEndPoint();
            return endpoint.sendResponse(req, res, anomalyDetectionResult.error, anomalyDetectionResult.error.code);
        }

        next();
        return;
    }

    static async authenticateKey(req, res, next) {
        const publicKey = req.get("Public-API-Key");

        const authenticator = new APIAuthenticator();
        const authentication = await authenticator.authenticateKey(publicKey);

        if (authentication.isAuthenticated) {
            next();
            return;
        }

        const endpoint = new APIEndPoint();
        endpoint.sendResponse(req, res, authentication.error, authentication.error.code);
    }

    static async authenticateSignature(req, res, next) {
        const authenticator = new APIAuthenticator();
        const authentication = await authenticator.authenticateSignature(req);

        if (authentication.isAuthenticated) {
            next();
            return;
        }

        const endpoint = new APIEndPoint();
        endpoint.sendResponse(req, res, authentication.error, authentication.error.code);
    }

    static async getPatron(...args) {
        const endpoint = new APIGetPatron();
        endpoint.processRequest(...args);
    }

    static async getHost(...args) {
        const endpoint = new APIGetHost();
        endpoint.processRequest(...args);
    }

    static async getFeaturedParties(...args) {
        const endpoint = new APIGetFeaturedParties();
        endpoint.processRequest(...args);
    }

    static async getParty(...args) {
        const endpoint = new APIGetParty();
        endpoint.processRequest(...args);
    }

    static async postParty(req, res) {
        const validator = new APIValidator();
        const endpoint = new APIPostParty();
        const postPartySchema = require('./schema/post-party-schema');
        validator.validateBody(req, res, endpoint.processRequest.bind(endpoint, req, res), postPartySchema);
    }

    static async updateParty(req, res) {
        const validator = new APIValidator();
        const endpoint = new APIUpdateParty();
        const updatePartySchema = require('./schema/update-party-schema');
        validator.validateBody(req, res, endpoint.processRequest.bind(endpoint, req, res), updatePartySchema);
    }
}

module.exports = APIController;