const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const { validationResult } = require("express-validator");

const capitalizer = require("../../../utils/capitilzer");
const CustomerService = require("../../services/customer-service");
const CreateService = require("../../services/create-service");
const APISecurity = require("../../lib/api-security");
const PartyService = require("../../services/party-service");
const HostService = require("../../services/host-service");

class APIPostParty extends APIEndPoint {
    async processRequest(req, res) {
        try {
            const publicKey = req.get("Public-API-Key");
            let body;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                body = this.getDummyBody();
            } else {
                body = req.body;

                // validation logic
                const result = validationResult(req);

                if (result.errors.length > 0) {
                    return this.sendResponse(req, res, {
                        result: false,
                        error: result.errors[0].msg
                    }, 406);
                }
            }

            let resultData;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                resultData = this.getDummyData();
            } else {
                const hostId = await CustomerService.getCustomerUserIdFromPublicKey(publicKey);

                // authentication logic
                const authenticator = new APIAuthenticator();

                const authorization = await authenticator.authenticateHost(publicKey, hostId);
                if (!authorization.isAuthenticated) {
                    return this.sendResponse(req, res, {
                        result: true,
                        error: authorization.error
                    }, authorization.error.code);
                }

                const security = new APISecurity();

                const title = capitalizer.fixCapitalization(security.sanitizeInput(body.title));

                const party = await CreateService.getPartyByTitle(title);

                if (party) {
                    return this.sendResponse(req, res, { result: false, message: 'Bad Request.'  }, 400);
                }

                const address = body.address ? {
                    streetAddress: capitalizer.fixCapitalization(security.sanitizeInput(body.address.streetAddress)),
                    postalCode: parseInt(security.sanitizeInput(body.address.postalCode)),
                    city: capitalizer.fixCapitalization(security.sanitizeInput(body.address.city)),
                    state: security.sanitizeInput(body.address.state).toUpperCase(),
                } : null;

                if (!address) {
                    return this.sendResponse(req, res, { result: false, message: 'Bad Request.' }, 400);
                }

                const privacy = body.privacy ? security.sanitizeInput(body.privacy) : 'Discoverable'; 
                const start = body.start ? 
                { 
                    date: security.sanitizeInput(body.start.date),
                    time: security.sanitizeInput(body.start.time) 
                }
                : 
                { 
                    date: 'Friday', 
                    time: '9:00 PM' 
                }; 

                const startDate = this.getNextDayTime(start.date, start.time); 
                const vibes = capitalizer.fixCapitalization(security.sanitizeInput(body.vibes));
                const description = security.sanitizeInput(body.description); 
                const pictureBase64 = security.sanitizeInput(body.pictureBase64);

                const secretKey = this.generateSecretKey(); 

                const partyId = await CreateService.createParty(title, privacy, startDate, vibes, description, pictureBase64, secretKey);

                if (!partyId) {
                    return this.sendResponse(req, res, { result: false }, 500);
                }

                const addressId = await CreateService.createAddress(address.streetAddress, address.postalCode, address.city, address.state);

                if (!addressId) {
                    await CreateService.deleteParty(partyId); 
                    return this.sendResponse(req, res, { result: false }, 500);
                }

                const partyAddressLinkId = await CreateService.createPartyAddressLink(partyId, addressId);

                if (!partyAddressLinkId) {
                    await CreateService.deleteParty(partyId);
                    await CreateService.deleteAddress(addressId);
                    return this.sendResponse(req, res, { result: false }, 500);
                }

                const partyOwnerlinkId = await CreateService.linkOwner(partyId, hostId);

                if (!partyOwnerlinkId) {
                    await CreateService.deleteParty(partyId);
                    await CreateService.deleteAddress(addressId);
                    await CreateService.deletePartyAddressLink(partyAddressLinkId);
                    return this.sendResponse(req, res, { result: false }, 500);
                }

                resultData = await PartyService.getPartyById(partyId);
                resultData.host = await HostService.getHostInfo(hostId);
                resultData.address = await PartyService.getPartyAddress(partyId);
            }

            this.sendResponse(req, res, {
                result: true,
                party: resultData
            });
        } catch(e) {
            console.log(e);
            this.sendResponse(req, res, this.internalServerErrorReturn, 500);
        }
    }
    
    async checkIfUniquePartyTitle(req, res) {
        const partyTitle = capitalizer.fixCapitalization(req.params.partyTitle);

        const party = await CreateService.getPartyByTitle(partyTitle); 

        res.send({
            result: !party 
        });
    }

    generateSecretKey(length = 32) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        let secretKey = '';

        for (let i = 0; i < length; i++) {
            secretKey += chars[Math.floor(Math.random() * chars.length)];
        }

        return secretKey; 
    }

    getNextDayTime(day, time) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided.");

        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7;
        }

        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0);

        return targetDate;
    }

    parseAddress(address) {
        const match = address.match(/^(\d+)\s+(.*)$/); 
        
        if (!match) {
            throw new Error("Invalid address format"); 
        }

        const streetNumber = parseInt(match[1], 10); 
        const streetName = match[2];

        return { streetNumber, streetName };
    }

    formatResultData(party, host, address) {
        const body = {
            id: 69,
            startTime: party.startTime,
            title: party.title,
            vibes: party.vibes,
            description: party.description,
            privacy: party.privacy,
            pictureBase64: party.pictureBase64,
            host: {},
            address: {}
        }

        body.host = {
            id: host.id,
            username: host.username,
            pictureBase64: host.pictureBase64,
            description: host.description,
            tags: host.tags
        }

        body.address = {
            id: address.id,
            created: address.created,
            state: address.state,
            city: address.city,
            postalCode: address.postalCode,
            streetAddess: address.streetAddess,
            apt: address.apt
        }

        return body;
    }

    getDummyBody() {
        return {
            hostId: 420,
            start: {
                date: "Friday",
                time: "7:30 PM"
            },
            title: "Pi-tacular pi-arty!",
            vibes: "pi-day,314,pi,pie",
            description: "A Pi-tacular pi-arty on pi-day!",
            privacy: "Discoverable",
            pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
            address: {
                state: "OR",
                city: "Eugene",
                postalCode: 97401,
                streetAddess: "710 E 18th Ave",
            }
        };
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
        };
    }
}

module.exports = APIPostParty;