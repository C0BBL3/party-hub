/*
Creates a Controller for the Join screen
Author Colby Roberts
*/
const ListService = require('../../../host/services/list');  // Import ListService to get RSVP count information
const JoinService = require('../../services/join');  // Import JoinService to retrieve party details

class JoinController {
    // Render the join page
    static async render(req, res) {
        const secretKey = req.params.secretKey;  // Retrieve the secret key from the URL parameters

        // Check if the user is logged in. If not, redirect them to the login page and pass a redirect URL to return here
        if (!req.session.user) {
            return res.redirect(`/login?redirect=party/${secretKey}`);  // Redirect to login with the current URL to come back to after login
        }

        const user = req.session.user;  // Get the logged-in user's data from the session

        // Retrieve party details using the secret key
        const party = await JoinService.getPartyBySecretKey(secretKey);

        // If no party is found with that secret key, render the join page without party data
        if (!party) {
            return res.render('join/join', {
                user,  // Pass the logged-in user's data to the view
                partyId: null,  // No party to join, so pass null
            });
        }

        // Get the current RSVP count for the party
        const rsvpCount = await ListService.getRSVPCountByPartyId(party.id);

        // If the party has reached the maximum number of patrons (100), do not allow joining
        if (rsvpCount >= 100) {
            return res.render('join/join', {
                user,  // Pass the logged-in user's data to the view
                partyId: null,  // Since the party is full, pass null to indicate no joining is possible
            });
        }

        // Render the join page with the party's ID for the user to join if the party is available
        res.render('join/join', {
            user,      // Pass the logged-in user's data to the view
            partyId: party ? party.id : null,  // Pass the party ID if the party is valid, otherwise null
        });
    }
}

module.exports = JoinController;  // Export the JoinController class for use in the router