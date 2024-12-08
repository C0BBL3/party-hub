/*
Creates an API Controller for the Create screen
Author Colby Roberts
*/
const CreateService = require('../../services/create'); // Service layer for party-related operations
const capitalizer = require("../../../../utils/capitilzer"); // Utility for capitalizing strings

class CreateAPIController {
    // Checks if the party title is unique
    static async checkIfUniquePartyTitle(req, res) {
        const partyTitle = capitalizer.fixCapitalization(req.params.partyTitle); // Normalize party title capitalization

        const party = await CreateService.getPartyByTitle(partyTitle); // Query service to check if the party exists

        res.send({
            result: !party // Return true if the title is unique, false otherwise
        });
    }

    // Generates a random secret key with alphanumeric characters
    static generateSecretKey(length = 32) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Base 36 with added uppercase
        let secretKey = '';

        for (let i = 0; i < length; i++) {
            // Select random characters to construct the key
            secretKey += chars[Math.floor(Math.random() * chars.length)];
        }

        return secretKey; // Return the generated secret key
    }

    // Calculates the next occurrence of a given day and time
    static getNextDayTime(day, time) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Days mapping
        
        const now = new Date(); // Current date and time
        const currentDayIndex = now.getDay(); // Index of the current day
        
        // Split time into hours, minutes, and AM/PM period
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        
        // Convert time to 24-hour format
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        // Get the index of the target day
        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided.");

        // Calculate the number of days until the target day
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7; // If the time has already passed today, target next week's day
        }

        // Create a new date for the target day and time
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0);

        return targetDate; // Return the target date and time
    }

    // Parses an address string into components (street number and name)
    static parseAddress(address) {
        const match = address.match(/^(\d+)\s+(.*)$/); // Regex to extract street number and name
        
        if (!match) {
            throw new Error("Invalid address format"); // Throw error if address format is invalid
        }

        const streetNumber = parseInt(match[1], 10); // Extract and parse street number
        const streetName = match[2]; // Extract street name

        return { streetNumber, streetName }; // Return parsed address as an object
    }

    // Handles requests to create a new party
    static async requestCreateParty(req, res) {
        const body = req.body; // Extract request body
        const owner = req.session.user; // Get owner information from session

        // Normalize input fields
        const title = capitalizer.fixCapitalization(body.title.trim());
        const address = body.address ? {
            streetAddress: capitalizer.fixCapitalization(body.address.streetAddress.trim()),
            postalCode: parseInt(body.address.postalCode),
            city: capitalizer.fixCapitalization(body.address.city.trim()),
            state: body.address.state.toUpperCase(),
        } : null;

        if (!address) {
            return res.send({ result: false }); // Respond with failure if no address is provided
        }

        const privacy = body.privacy ? body.privacy : 'Discoverable'; // Default to 'Discoverable' if privacy is not provided
        const start = body.start ? body.start : { date: 'Friday', time: '9:00 PM' }; // Default start date and time
        const startDate = CreateAPIController.getNextDayTime(start.date, start.time); // Calculate start date and time
        const vibes = capitalizer.fixCapitalization(body.vibes.trim()); // Normalize vibes
        const description = body.description.trim(); // Trim description
        const pictureBase64 = body.pictureBase64.trim(); // Trim picture data

        const secretKey = CreateAPIController.generateSecretKey(); // Generate a unique secret key for the party

        // Create the party
        const partyId = await CreateService.createParty(title, privacy, startDate, vibes, description, pictureBase64, secretKey);

        if (!partyId) {
            return res.send({ result: false }); // Respond with failure if party creation fails
        }

        // Create address entry
        const addressId = await CreateService.createAddress(address.streetAddress, address.postalCode, address.city, address.state);

        if (!addressId) {
            await CreateService.deleteParty(partyId); // Rollback party creation on failure
            return res.send({ result: false });
        }

        // Link party and address
        const partyAddressLinkId = await CreateService.createPartyAddressLink(partyId, addressId);

        if (!partyAddressLinkId) {
            await CreateService.deleteParty(partyId); // Rollback previous creations on failure
            await CreateService.deleteAddress(addressId);
            return res.send({ result: false });
        }

        // Link party owner
        const partyOwnerlinkId = await CreateService.linkOwner(partyId, owner.id);

        if (!partyOwnerlinkId) {
            await CreateService.deleteParty(partyId); // Rollback all changes on failure
            await CreateService.deleteAddress(addressId);
            await CreateService.deletePartyAddressLink(partyAddressLinkId);
            return res.send({ result: false });
        }

        res.send({
            result: true,
            party: {
                title,
                description
            }
        }); // Respond with success and party details
    }
}

module.exports = CreateAPIController; // Export the controller
