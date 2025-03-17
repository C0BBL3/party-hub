const CustomerService = require("../services/customer-service");
const APIValidator = require("./api-validator");
const CryptoJS = require('crypto-js')

class APIAuthenticator {
    constructor() { 
        this.internalServerErrorReturn = {
            isAuthenticated: false,
            error: { code: 500, message: "Internal server error." }
        };

        this.authenticatedReturn = {
            isAuthenticated: true,
            error: null
        };

        this.notAuthenticatedReturn = {
            isAuthenticated: false,
            error: { code: 401, message: "You are not authorized for this request." }
        };
    }

    generateSignature(secretKey, verb, body, contentType, requestURI, timestamp, nonce) {
        const contentMD5 = CryptoJS.MD5(body).toString(CryptoJS.enc.Hex);
        const StringToSign = verb + '\n'
                           + contentMD5 + '\n'
                           + contentType + '\n'
                           + timestamp + '\n'
                           + requestURI + '\n'
                           + nonce;

        const signature = CryptoJS.HmacSHA256(StringToSign, secretKey).toString(CryptoJS.enc.Base64);

        return signature;
    }

    async authenticateSignature(req) {
        try {
            const publicKey = req.header("Public-API-Key");

            const validator = new APIValidator();
            const customer = await validator.validatePublicKey(publicKey);

            if (customer.valid) {
                const secretKey = await CustomerService.getSecretKey(customer.customerId, publicKey);

                const verb = req.method;
                const body = JSON.stringify(req.body);
                const contentType = req.header("Content-Type");
                const timestamp = req.header("X-TXC-Timestamp");
                const requestURI = req.url;
                const nonce = req.header("X-TXC-Nonce");

                const authorizationHeader = req.header("Authorization");
                const clientSignature = authorizationHeader.split(' ')[1].split(":")[1];

                const expectedSignature = this.generateSignature(secretKey, verb, body, contentType, requestURI, timestamp, nonce);

                if (clientSignature === expectedSignature) {
                    return this.authenticatedReturn;
                } else {
                    return this.notAuthenticatedReturn;
                }
            } else {
                return customer.error;
            }
        } catch(e) {
            console.log(e);
            return this.internalServerErrorReturn;
        }
    }

    async authenticateKey(publicKey) {
        try {
            const validator = new APIValidator();
            const customer = await validator.validatePublicKey(publicKey);

            if (customer.valid) {
                return this.authenticatedReturn;
            } else {
                return {
                    isAuthenticated: false,
                    error: { code: 406, message: `Invalid public key.` }
                }
            }
        } catch {
            return this.internalServerErrorReturn;
        }
    }

    async authenticatePatron(publicKey, patronId) {
        const isAuthenticated = await CustomerService.checkAuthorizationForPatron(publicKey, patronId);
        return isAuthenticated ? this.authenticatedReturn : this.notAuthenticatedReturn;
    }

    async authenticateHost(publicKey, hostId) {
        const isAuthenticated = await CustomerService.checkAuthorizationForHost(publicKey, hostId);
        return isAuthenticated ? this.authenticatedReturn : this.notAuthenticatedReturn;
    }

    async authenticateParty(publicKey, partyId) {
        const isAuthenticated = await CustomerService.checkAuthorizationForParty(publicKey, partyId);
        return isAuthenticated ? this.authenticatedReturn : this.notAuthenticatedReturn;
    }
}

module.exports = APIAuthenticator;