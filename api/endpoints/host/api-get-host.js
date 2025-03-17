const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const APIParameter = require("../../lib/api-parameter");
const APIValidator = require("../../lib/api-validator");
const HostService = require("../../services/host-service");
const PartyService = require("../../services/party-service");

class APIGetHost extends APIEndPoint {
    async processRequest(req, res) {
        try {
            const publicKey = req.get("Public-API-Key");
            const patronIdentification = req.params.hostId;

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

            let host;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                host = this.getDummyData();
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

                host = await HostService.getHostInfo(userId);
                host.hosting = await PartyService.getCurrentHostParties(userId);
                host.rsvp = await PartyService.getCurrentPatronParties(userId);
            }

            this.sendResponse(req, res, {
                result: true,
                host
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
            username: "joe_smith",
            email: "joe_smith@somemail.com",
            deactivated: false,
            isHost: 0,
            hosting: [
                {
                    id: 69,
                    name: "Pi-tacular pi-arty!",
                    hostId: 1234,
                    rsvp: "2025-03-14 19:30:00",
                    attending: 5,
                    capacity: 314
                },
                {
                    id: 123,
                    name: "The Bedbugs will bite tonite!",
                    hostId: 1234,
                    rsvp: "2025-03-15 21:30:00",
                    attending: 23,
                    capacity: 30
                },
            ],
            rsvp: [
                {
                    id: 69,
                    name: "St. Patty's Day Party",
                    hostId: 420,
                    rsvp: "2025-03-15 19:30:00",
                    attending: 41,
                    capacity: 315
                },
            ],
        };
    }
}

module.exports = APIGetHost;