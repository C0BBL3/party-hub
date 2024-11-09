const CreateService = require('../../services/create');
const capitalizer = require("../../../../utils/capitilzer");

class CreateAPIController {
    static async checkIfUniquePartyTitle(req, res) {
        const partyTitle = capitalizer.fixCapitalization(req.params.partyTitle);

        const party = await CreateService.getPartyByTitle(partyTitle);

        res.send({
            result: !party
        });
    }

    static generateGroupSecretKey(length = 32) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // base 36 w/ capital letters
        
        let secretKey = '';

        for (let i = 0; i < length; i++) {
            secretKey += chars[Math.floor(Math.random() * chars.length)];
        }

        return secretKey;
    }

    static getNextDayTime(day, time) {
        // Days of the week map
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Get the current date and day index
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        // Parse time (e.g., "9:00 PM")
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        
        // Convert hour to 24-hour format
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        
        // Find target day index
        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided.");
        
        // Calculate days until the target day
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7;
        }
        
        // Create the Date object for the target day and time
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0);
        
        return targetDate;
    }

    static parseAddress(address) {
        // Use regex to capture the street number and street name
        const match = address.match(/^(\d+)\s+(.*)$/);
        
        if (!match) {
            throw new Error("Invalid address format");
        }
        
        const streetNumber = parseInt(match[1], 10);
        const streetName = match[2];
        
        return { streetNumber, streetName };
    }

    static async requestCreateParty(req, res) {
        const body = req.body;

        const owner = req.session.user;

        const title = capitalizer.fixCapitalization(body.title.trim());
        const address = body.address ? {
            streetAddress: capitalizer.fixCapitalization(body.address.streetAddress.trim()),
            postalCode: parseInt(body.address.postalCode),
            city: capitalizer.fixCapitalization(body.address.city.trim()),
            state: body.address.state.toUpperCase(),
        } : null;

        if (!address) {
            return res.send({
                result: false
            });
        }

        const privacy = body.privacy ? body.privacy : 'Discoverable';
        const start = body.start ? body.start : { data: 'Friday', time: '9:00 PM' };
        const startDate = CreateAPIController.getNextDayTime(start.date, start.time);
        const vibes = capitalizer.fixCapitalization(body.vibes.trim());
        const description = body.description.trim();

        const secretKey = CreateAPIController.generateGroupSecretKey();
 
        const partyId = await CreateService.createParty(title, privacy, startDate, vibes, description, secretKey);

        if (!partyId) {
            res.send({
                result: false
            });
        }

        const addressId = await CreateService.createAddress(address.streetAddress, address.postalCode, address.city, address.state);

        if (!addressId) {
            await CreateService.deleteParty(partyId);

            return res.send({
                result: false
            });
        }

        const partyAddressLinkId = await CreateService.createPartyAddressLink(partyId, addressId);

        if (!partyAddressLinkId) {
            await CreateService.deleteParty(partyId);
            await CreateService.deleteAddress(addressId);

            return res.send({
                result: false
            });
        }

        const partyOwnerlinkId = await CreateService.linkOwner(partyId, owner.id);

        if (!partyOwnerlinkId) {
            await CreateService.deleteParty(partyId);
            await CreateService.deleteAddress(addressId);
            await CreateService.deletePartyAddressLink(partyAddressLinkId);

            return res.send({
                result: false
            });
        }

        res.send({
            result: true,
            party: {
                title,
                description
            }
        });
    }
}

module.exports = CreateAPIController;