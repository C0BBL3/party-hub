/*
Creates a Controller for the Signup screen
Author Colby Roberts
*/
const SignupService = require('../../services/signup'); // Import the SignupService for handling signup-related logic

class SignupController {
    // This method handles rendering the signup page
    static async render(req, res) {
        const user = req.session.user;  // Retrieve the user data from the session (if any)

        // Render the signup view and pass the user data (if logged in) to the view
        res.render('signup/signup', {
            user  // Pass user data to the view
        });
    }
}

module.exports = SignupController;  // Export the SignupController for use in other parts of the application