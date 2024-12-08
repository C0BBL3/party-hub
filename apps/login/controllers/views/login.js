/*
Creates a Controller for the Login screen
Author Colby Roberts
*/
const LoginService = require('../../services/login');  // Importing LoginService to interact with the login-related functionality

class LoginController {
    // Renders the login screen and handles redirection if needed
    static async render(req, res) {
        // Check if there is a "redirect" query parameter in the URL, and if so, store it in the session for later use
        if (req.query.redirect) { 
            req.session.redirect_url = req.query.redirect;  // Store the redirect URL in the session
        }

        const user = req.session.user;  // Retrieve the user from the session, if already logged in

        // Render the login page with the user data (if any)
        res.render('login/login', {
            user  // Pass the user data to the view
        });
    }

    // Handles the user login process based on the user ID
    static async loginuser(req, res) {
        const id = req.params.id;  // Retrieve the user ID from the route parameters

        const user = await LoginService.getUserById(id);  // Fetch the user details using the LoginService

        // If the user is an admin, set "isSupervisorMode" to 1 (this could indicate an admin view mode)
        if (user.isAdmin) {
            user.isSupervisorMode = 1;  
        }

        // Store the user in the session to keep them logged in
        req.session.user = user;

        // Set a custom session variable (possibly for tracking)
        req.session.x = 7;

        // Redirect the user to the '/party/feed' page after a short delay (using setTimeout)
        setTimeout(() => { 
            res.redirect('/party/feed');  // After the delay, redirect to the party feed
        }, 1000);  // Delay set to 1 second (1000 milliseconds)
    }
}

module.exports = LoginController;  // Export the LoginController for use in other parts of the application