/*
Creates an API Controller for the List screen
Author Colby Roberts
*/
const ListService = require('../../services/list'); // Service layer for party list-related operations

class ListAPIController {
    // Fetches a list of upcoming parties for the current user
    static async getUpcomingParties(req, res) {
        const user = req.session.user; // Current user from session
        const hostId = parseInt(req.params.hostId); // Host ID from request parameters

        // Ensure the requesting user is the host
        if (user.id != hostId) {
            return res.send({ result: false }); // Respond with failure if user mismatch
        }

        // Get upcoming parties hosted by the user
        const upcoming = await ListService.getUpcomingParties(user.id);

        // Add RSVP count for each party
        for (let party of upcoming) {
            let rsvpCount = await ListService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount; // Attach RSVP count to the party object
        }

        // Send the list of upcoming parties with RSVP counts
        res.send({
            result: true,
            upcoming
        });
    }

    // Fetches a list of past parties for the current user
    static async getPastParties(req, res) {
        const user = req.session.user; // Current user from session
        const hostId = parseInt(req.params.hostId); // Host ID from request parameters

        // Ensure the requesting user is the host
        if (user.id != hostId) {
            return res.send({ result: false }); // Respond with failure if user mismatch
        }

        // Get past parties hosted by the user
        const past = await ListService.getPastParties(user.id);

        // Add RSVP count for each party
        for (let party of past) {
            let rsvpCount = await ListService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount; // Attach RSVP count to the party object
        }

        // Send the list of past parties with RSVP counts
        res.send({
            result: true,
            past
        });
    }

    // Generates a shareable link for a specific party
    static async getPartyLink(req, res) {
        const user = req.session.user; // Current user from session
        const hostId = parseInt(req.params.hostId); // Host ID from request parameters

        // Ensure the requesting user is the host
        if (user.id != hostId) {
            return res.send({ result: false }); // Respond with failure if user mismatch
        }

        const partyId = parseInt(req.params.partyId); // Party ID from request parameters

        // Get the secret key associated with the party
        const secretKey = await ListService.getPartySecretKey(partyId);

        if (secretKey) {
            // Construct the shareable party link
            const BASE_URL = req.protocol + '://' + req.get('host'); // Build base URL from request
            return res.send({
                result: true,
                link: `${BASE_URL}/party/secret${secretKey}` // Full link with secret key
            });
        } else {
            return res.send({ result: false }); // Respond with failure if no secret key found
        }
    }
}

module.exports = ListAPIController; // Export the controller for use in routes