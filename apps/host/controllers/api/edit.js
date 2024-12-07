/*
Creates an API Controller for the Edit screen
Author Colby Roberts
*/
const EditService = require('../../services/edit');
const capitalizer = require("../../../../utils/capitilzer");

class EditAPIController {
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

    static async requestEditParty(req, res) {
        const body = req.body;

        const user = req.session.user;

        const userId = body.userId;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        const partyId = body.partyId;
        
        const isHost = await EditService.checkIfUserIsHost(partyId, userId);

        if (!isHost) {
            return res.send({ result: false });
        }

        const party = await EditService.getPartyById(partyId);
        
        const privacy = body.privacy ? body.privacy : 'Discoverable';
        const startTime = body.startTime;
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const startDay = days[party.startTime.getDay()];
        const startDate = EditAPIController.getNextDayTime(startDay, startTime);
        const vibes = capitalizer.fixCapitalization(body.vibes.trim());
        const description = body.description.trim();
        const pictureBase64 = body.pictureBase64.trim();

        const update = await EditService.updateParty(partyId, privacy, startDate, vibes, description, pictureBase64);

        return res.send({ result: update });
    }
   
}

module.exports = EditAPIController;