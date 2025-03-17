const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const PartyService = require("../../services/party-service");
const CustomerService = require("../../services/customer-service");

class APIGetFeaturedParties extends APIEndPoint {
    async processRequest(req, res) {
        try {
            const publicKey = req.get("Public-API-Key");

            let parties;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                parties = this.getDummyData();
            } else {
                const userId = await CustomerService.getCustomerUserIdFromPublicKey(publicKey);
                parties = await PartyService.getFeaturedParties(userId);
            }

            this.sendResponse(req, res, {
                result: true,
                parties
            });
        } catch(e) {
            this.sendResponse(req, res, {
                result: false,
                error: { code: 500, message: "Internal server error." }
            }, 500);
        }
    }

    getDummyData() {
        return  [
            {
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
            },
            {
                id: 123,
                name: "The Bedbugs will bite tonite!",
                vibes: "late,fun",
                description: "Late night party!",
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
            },
        ];
    }
}

module.exports = APIGetFeaturedParties;