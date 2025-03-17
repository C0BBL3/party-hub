const APIEndPoint = require("../api-endpoint");
const APIAuthenticator = require("../../lib/api-authenticator");
const { validationResult } = require("express-validator");

const capitalizer = require("../../../utils/capitilzer");
const APISecurity = require("../../lib/api-security");
const EditService = require("../../services/edit-service");
const APIValidator = require("../../lib/api-validator");
const PartyService = require("../../services/party-service");

class APIUpdateParty extends APIEndPoint {
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

                const validator = new APIValidator();
                const validateResult = await validator.validatePartyId(body.partyId);

                // validation logic
                if (!validateResult.valid) {
                    return this.sendResponse(req, res, {
                        result: false,
                        error: validateResult.error
                    }, validateResult.error.code);
                }
            }

            let resultData;

            if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') {
                resultData = this.getDummyData();
            } else {
                const partyId = body.partyId; 

                // authentication logic
                const authenticator = new APIAuthenticator();
        
                const authentication = await authenticator.authenticateParty(publicKey, partyId);
                if (!authentication.isAuthenticated) {
                    return this.sendResponse(req, res, {
                        result: false,
                        error: authentication.error
                    }, authentication.error.code);
                }

                const party = await EditService.getPartyById(partyId);

                const security = new APISecurity();

                const privacy = body.privacy ? security.sanitizeInput(body.privacy) : 'Discoverable';
                const startTime = security.sanitizeInput(body.start.time); 
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; 
                const startDay = days[party.startDate.getDay()]; 
                const startDate = this.getNextDayTime(startDay, startTime); 
                const vibes = capitalizer.fixCapitalization(security.sanitizeInput(body.vibes));
                const description = security.sanitizeInput(body.description); 
                const pictureBase64 = security.sanitizeInput(body.pictureBase64);

                const update = await EditService.updateParty(partyId, privacy, startDate, vibes, description, pictureBase64);

                if (!update) {
                    throw new Error(); 
                }

                resultData = await PartyService.getPartyById(partyId);
            }

            this.sendResponse(req, res, {
                result: true,
                body: resultData
            });
        } catch(e) {
            console.log(e);
            this.sendResponse(req, res, this.internalServerErrorReturn, 500);
        }
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

    formatResultData(party, host, address) {
        const body = {
    
        }

        return body;
    }

    getDummyBody() {
        return {
            partyId: 420,
            start: {
                day: "Friday",
                time: "7:30 PM"
            },
            vibes: "pi-day,314,pi,pie",
            description: "A Pi-tacular pi-arty on pi-day!",
            privacy: "Discoverable",
            pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
        };
    }

    getDummyData() {
        return { result: true }
    }
}

module.exports = APIUpdateParty;