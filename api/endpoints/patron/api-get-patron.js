const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const APIParameter = require("../../lib/api-parameter");
const APIValidator = require("../../lib/api-validator");
const PatronService = require("../../services/patron-service");
const PartyService = require("../../services/party-service");
const UserService = require("../../services/user-service");

class APIGetPatron extends APIEndPoint {
    async processRequest(req, res) {
        try {
            const publicKey = req.get("Public-API-Key");
            const patronIdentification = req.params.patronId;

            const parameter = new APIParameter();

            const identificationType = parameter.deduceUserIdentificationType(patronIdentification);

            let validateResult;
            const validator = new APIValidator();

            switch(identificationType) {
                case 'id':
                    validateResult = await validator.validateUserId(patronIdentification);
                    break;
                case 'email':
                    validateResult = await validator.validateUserEmail(patronIdentification);
                    break;
                case 'username':
                    validateResult = await validator.validateUserUsername(patronIdentification);
                    break;
                default:
                    return this.sendResponse(req, res, {
                        result: false,
                        error: 'Unsupported Media Type.'
                    }, 415);
            }

            // validation logic
            if (!validateResult.valid) {
                return this.sendResponse(req, res, {
                    result: false,
                    error: validateResult.error
                }, validateResult.error.code);
            }

            let patron;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                patron = this.getDummyData();
            } else {
                let user, userId;

                switch(identificationType) {
                    case 'id':
                        userId = parseInt(patronIdentification); // patronIdentification already is a patronId
                        break;
                    case 'email':
                        user = await UserService.getUserByEmail(patronIdentification);
                        userId = parseInt(user.id);
                        break;
                    case 'username':
                        user = await UserService.getUserByUsername(patronIdentification);
                        userId = parseInt(user.id);
                        break;
                }

                if (userId === null || userId === undefined) {
                    return this.sendResponse(req, res, {
                        result: false,
                        error: 'Not Found.'
                    }, 404);
                }

                // authentication logic
                const authenticator = new APIAuthenticator();

                const authentication = await authenticator.authenticatePatron(publicKey, userId);
                if (!authentication.isAuthenticated) {
                    this.sendResponse(req, res, {
                        result: false,
                        error: authentication.error
                    }, authentication.error.code);
                }

                patron = await PatronService.getPatronInfo(userId);
                patron.parties = await PartyService.getCurrentPatronParties(userId);
            }

            this.sendResponse(req, res, {
                result: true,
                patron
            });
        } catch(e) {
            this.sendResponse(req, res, {
                result: false,
                error: { code: 500, message: "Internal server error." }
            }, 500);
        }
    }

    getDummyData() {
        return {
            id: 1234,
            created: "2024-07-30 11:07:27",
            firstName: "Joe",
            lastName: "Smith",
            email: "joe_smith@somemail.com",
            deactivated: false,
            isHost: 0,
            parties: [
                {
                    id: 69,
                    name: "Pi-tacular pi-arty!",
                    hostId: 420,
                    rsvp: "2025-03-14 19:30:00",
                    attending: 5,
                    capacity: 314
                },
                {
                    id: 123,
                    name: "The Bedbugs will bite tonite!",
                    hostId: 21,
                    rsvp: "2025-03-15 21:30:00",
                    attending: 23,
                    capacity: 30
                },
                
            ],
        };
    }
}

module.exports = APIGetPatron;