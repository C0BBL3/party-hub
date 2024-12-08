/*
Creates a Controller for the Create screen
Author: Colby Roberts
*/
const CreateService = require('../../services/create'); // Importing the service layer for create operations

class CreateController {
    // Renders the Create screen with user data
    static async render(req, res) {
        const user = req.session.user; // Retrieves the user information from the session

        // Render the 'create/create' view with user data and section info
        res.render('create/create', {
            user,          // Pass user data to the view
            section: 'create'  // Specify the section to identify the current page
        });
    }
}

module.exports = CreateController; // Export the controller to use in routes