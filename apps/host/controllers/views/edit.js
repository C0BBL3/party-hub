/*
Creates a Controller for the Edit screen
Author: Colby Roberts
*/
const EditService = require('../../services/edit'); // Importing the service layer for edit operations

class EditController {
    // Renders the Edit screen with party data
    static async render(req, res) {
        const user = req.session.user; // Retrieves the user information from the session

        // Check if the user is logged in. If not, redirect to the login page.
        if (!user || !user.id) {
            return res.redirect('/login');
        }

        const partyId = req.query.id; // Get the party ID from the query parameters

        // Check if the user is the host of the party by calling the EditService
        const isOwner = await EditService.checkIfUserIsHost(partyId, user.id);

        // If the user is not the host, redirect to the create party page
        if (!isOwner) {
            return res.redirect('/host/create');
        }

        // Get the party details using the party ID
        const party = await EditService.getPartyById(partyId);  

        // Render the 'edit/edit' view, passing in the user and party data
        res.render('edit/edit', {
            section: 'edit', // Identifies the current section (edit screen)
            user,            // Pass the logged-in user data
            party            // Pass the party data to the view for editing
        });
    }
}

module.exports = EditController; // Export the controller for use in routes