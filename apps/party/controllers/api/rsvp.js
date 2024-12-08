/*
Creates an API Controller for the RSVP screen
Author Colby Roberts
*/
const FeedService = require('../../services/feed');  // Import FeedService to fetch party details
const RSVPService = require('../../services/rsvp');  // Import RSVPService to handle RSVP-related functionalities

class RSVPAPIController {
    // Fetches upcoming parties that the user has RSVP'd to
    static async getUpcomingParties(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const patronId = parseInt(req.params.patronId);  // Get patronId from URL parameters

        // Ensure the logged-in user matches the patronId in the URL
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Get a list of upcoming parties for the logged-in user
        const upcoming = await RSVPService.getUpcomingParties(user.id);

        // Loop through each party and add the RSVP count to the party object
        for (let party of upcoming) {
            let rsvpCount = await RSVPService.getRSVPCountByPartyId(party.id);  // Get RSVP count for each party
            party.rsvpCount = rsvpCount;  // Add the RSVP count to the party object
        }

        // Send the upcoming parties along with the RSVP count in the response
        res.send({
            result: true,
            upcoming
        });
    }

    // Fetches past parties that the user has attended
    static async getPastParties(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const patronId = parseInt(req.params.patronId);  // Get patronId from URL parameters

        // Ensure the logged-in user matches the patronId in the URL
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Get a list of past parties for the logged-in user
        const past = await RSVPService.getPastParties(user.id);

        // Loop through each past party and add the RSVP count
        for (let party of past) {
            let rsvpCount = await RSVPService.getRSVPCountByPartyId(party.id);  // Get RSVP count for each party
            party.rsvpCount = rsvpCount;  // Add the RSVP count to the party object
        }

        // Send the past parties along with RSVP counts in the response
        res.send({
            result: true,
            past
        });
    }

    // RSVP to a party by creating an RSVP entry with a generated secret key
    static async rsvp(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const { partyId, patronId } = req.body;  // Extract partyId and patronId from the request body

        // Ensure the logged-in user matches the patronId in the request body
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Generate a unique secret key for the RSVP
        const secretKey = RSVPAPIController.generateSecretKey();

        // Create the RSVP for the party and associate it with the patronId and secretKey
        const rsvpId = await RSVPService.rsvp(partyId, patronId, secretKey);

        // Respond with a success result
        return res.send({ result: true });
    }

    // Generates a random secret key for the RSVP process
    static generateSecretKey(length = 32) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';  // Characters to generate the key
        let secretKey = '';  // Initialize the secret key string

        // Loop to generate a random key of the specified length
        for (let i = 0; i < length; i++) {
            secretKey += chars[Math.floor(Math.random() * chars.length)];  // Append random character to the secret key
        }

        return secretKey;  // Return the generated secret key
    }

    // Check the RSVP status for a given party and patron
    static async checkStatus(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const { partyId, patronId } = req.params;  // Extract partyId and patronId from the URL parameters

        // Ensure the logged-in user matches the patronId in the URL
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Get the RSVP status for the given party and patron
        const status = await RSVPService.checkStatus(partyId, patronId);

        // Respond with the status and whether RSVP is enabled
        return res.send({ result: true, enabled: status.enabled });
    }

    // Cancel an RSVP for a given party and patron
    static async cancel(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const { partyId, patronId } = req.body;  // Extract partyId and patronId from the request body

        // Ensure the logged-in user matches the patronId in the request body
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Fetch the party details from FeedService to check the party start time
        const party = await FeedService.getParty(partyId);

        const nowUnix = new Date().getTime();  // Get the current time in milliseconds
        const partyStartTimeUnix = new Date(party.startTime).getTime();  // Get the party start time in milliseconds

        // If the party has already started, prevent the user from canceling the RSVP
        if (partyStartTimeUnix < nowUnix) { 
            return res.send({ result: false });  // Deny the cancelation if the party is in the past
        }

        // Proceed to cancel the RSVP
        const result = await RSVPService.cancel(partyId, patronId);

        // Respond with the result of the cancelation process
        return res.send({ result });
    }

    // Get a list of parties the user has RSVP'd to
    static async getRSVPedParties(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session
        const patronId = req.params.patronId;  // Extract patronId from URL parameters

        // Ensure the logged-in user matches the patronId in the URL
        if (user.id != patronId) {
            return res.send({ result: false });  // If IDs don't match, deny access
        }

        // Get the list of parties the user has RSVP'd to
        const parties = await RSVPService.getRSVPedParties(patronId);

        // Send the list of RSVP'd parties in the response
        return res.send({ result: true, parties });
    }
}

module.exports = RSVPAPIController;  // Export the RSVPAPIController module to be used elsewhere