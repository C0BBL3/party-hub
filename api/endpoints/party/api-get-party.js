const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const PartyService = require("../../services/party-service");
const APIValidator = require("../../lib/api-validator");

class APIGetParty extends APIEndPoint {
    async processRequest(req, res) {
        try {
            const publicKey = req.get("Public-API-Key");
            const partyId = req.params.partyId

            const validator = new APIValidator();

            const validateResult = await validator.validatePartyId(partyId);

            // validation logic
            if (!validateResult.valid) {
                return this.sendResponse(req, res, {
                    result: false,
                    error: validateResult.error
                }, validateResult.error.code);
            }

            let party;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                party = this.getDummyData();
            } else {
                // authentication logic
                const authenticator = new APIAuthenticator();

                const authentication = await authenticator.authenticateParty(publicKey, partyId);
                if (!authentication.isAuthenticated) {
                    this.sendResponse(req, res, {
                        result: false,
                        error: authentication.error
                    }, authentication.error.code);
                }

                party = await PartyService.getPartyById(partyId);
            }

            this.sendResponse(req, res, {
                result: true,
                party
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
            id: 69,
            startTime: "2025-03-14 19:30:00",
            title: "Pi-tacular pi-arty!",
            vibes: "pi-day,314,pi,pie",
            description: "A Pi-tacular pi-arty on pi-day!",
            privacy: "Discoverable",
            pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
            host: {
                id: 420,
                username: "joe_smith",
                pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
                description: "Hi, I'm Joe 'Joey' Smith, I like to host parties!",
                tags: "smithy,fun"
            },
            address: {
                id: 1323,
                created: "2025-03-14 12:30:00",
                state: "OR",
                city: "Eugene",
                postalCode: 97401,
                streetAddess: "710 E 18th Ave",
                apt: null,
            }
        }
    }
}

module.exports = APIGetParty;