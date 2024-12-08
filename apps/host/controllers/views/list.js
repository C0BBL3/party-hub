/*
Creates a Controller for the List screen
Author: Colby Roberts
*/
const ListService = require('../../services/list'); // Importing the service layer for list-related operations

class ListController {
    // Renders the List screen
    static async render(req, res) {
        const user = req.session.user; // Retrieves the user information from the session

        // Render the 'list/list' view with user data and section info
        res.render('list/list', {
            section: 'list', // Identifies the current section (list screen)
            user             // Pass user data to the view
        });
    }
}

module.exports = ListController; // Export the controller for use in routes