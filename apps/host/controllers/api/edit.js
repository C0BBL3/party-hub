/*
Creates an API Controller for the Edit screen
Author Colby Roberts
*/
const EditService = require('../../services/edit'); // Service layer for handling party edits
const capitalizer = require("../../../../utils/capitilzer"); // Utility for capitalizing strings

class EditAPIController {
    // Calculates the next occurrence of a given day and time
    static getNextDayTime(day, time) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Days mapping
        
        const now = new Date(); // Current date and time
        const currentDayIndex = now.getDay(); // Index of the current day
        
        // Split time into hours, minutes, and AM/PM period
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);

        // Convert time to 24-hour format
        if (period === "PM" && hour !== 12) hour += 12; // Add 12 hours for PM, except for 12 PM
        if (period === "AM" && hour === 12) hour = 0; // Convert 12 AM to 0 hours
        
        // Get the index of the target day
        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided."); // Validate day input

        // Calculate the number of days until the target day
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7; // If the time has already passed today, target next week's day
        }

        // Create a new date for the target day and time
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0); // Set target hours, minutes, and reset seconds/milliseconds

        return targetDate; // Return the target date and time
    }

    // Handles requests to edit an existing party
    static async requestEditParty(req, res) {
        const body = req.body; // Extract the request body
        const user = req.session.user; // Get the current user from the session
        const userId = body.userId; // Get the user ID from the request body

        // Ensure the user making the request matches the user in the session
        if (user.id != userId) {
            return res.send({ result: false }); // Respond with failure if user mismatch
        }

        const partyId = body.partyId; // Extract the party ID from the request body
        
        // Check if the user is the host of the party
        const isHost = await EditService.checkIfUserIsHost(partyId, userId);

        if (!isHost) {
            return res.send({ result: false }); // Respond with failure if user is not the host
        }

        // Retrieve the current party details
        const party = await EditService.getPartyById(partyId);

        // Update party details using request data or default values
        const privacy = body.privacy ? body.privacy : 'Discoverable'; // Default to 'Discoverable' if privacy is not provided
        const startTime = body.startTime; // New start time from request body
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Days mapping
        const startDay = days[party.startTime.getDay()]; // Get current party start day
        const startDate = EditAPIController.getNextDayTime(startDay, startTime); // Calculate next start date and time
        const vibes = capitalizer.fixCapitalization(body.vibes.trim()); // Normalize vibes input
        const description = body.description.trim(); // Trim description input
        const pictureBase64 = body.pictureBase64.trim(); // Trim picture data input

        // Update the party with the new details
        const update = await EditService.updateParty(partyId, privacy, startDate, vibes, description, pictureBase64);

        return res.send({ result: update }); // Respond with the result of the update operation
    }
}

module.exports = EditAPIController; // Export the controller
