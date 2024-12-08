/*
Creates a Controller for the RSVP screen
Author Colby Roberts
*/
const RSVPService = require('../../services/rsvp');  // Import RSVPService to interact with RSVP data (though it's not used in this specific function)

class RSVPController {
    // Render the RSVP page
    static async render(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session

        // Render the RSVP page, passing user data and section info
        res.render('rsvp/rsvp', {
            section: 'rsvp',  // Identifies the current section, used in the layout for navigation highlights
            user  // Pass the user data to the view
        });
    }
}

module.exports = RSVPController;  // Export the RSVPController class for use in the router