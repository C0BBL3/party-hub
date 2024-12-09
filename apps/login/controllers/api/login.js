/*
Creates an API Controller for the Login screen
Author Colby Roberts
*/
const LoginService = require('../../services/login');  // Importing the LoginService to handle business logic

class LoginAPIController {
    // The login method handles the login API request
    static async login(req, res) {
        // Extracting the username/email and password from the request body
        const usernameOrEmail = req.body.usernameOrEmail;
        const password = req.body.password;

        // Fetch user by username or email using the LoginService
        const user = await LoginService.getUserByUsernameOrEmail(usernameOrEmail);

        // Check if user is found and password matches the temp password (for new accounts or resets)
        if (user && user.password === password) {
            const user_ = await LoginService.getUserById(user.id);  // Fetch the newly created host user
            req.session.user = user_;  // Store the user in the session

            // If the user is an admin, set the supervisor mode flag
            if (req.session.user.isAdmin) {
                req.session.user.isSupervisorMode = 1;
            }

            // If there's a redirect URL saved in the session, redirect to that URL
            if (req.session.redirect_url) {
                const redirect_url = req.session.redirect_url;
                delete req.session.redirect_url;  // Delete the redirect URL to prevent future redirects
                return res.redirect(redirect_url);
            }

            // If no redirect URL, send a success response
            return res.send({
                result: true
            });
        } else if (user && user.salt && user.hash) { // User exists but password is not the temp one
            // Verify the password using the stored hash and salt
            const result = await LoginService.verifyPassword(password, user.salt, user.hash);

            // If the password is correct, log the user in
            if (result) {
                const user_ = await LoginService.getUserById(user.id);  // Fetch the newly created host user
                req.session.user = user_;  // Store the user in the session

                // If the user is an admin, set the supervisor mode flag
                if (req.session.user.isAdmin) {
                    req.session.user.isSupervisorMode = 1;
                }

                // If there's a redirect URL, redirect to it
                if (req.session.redirect_url) {
                    const redirect_url = req.session.redirect_url;
                    delete req.session.redirect_url;  // Clear the redirect URL from session
                    return res.redirect(redirect_url);
                }

                // If no redirect URL, send a success response
                return res.send({
                    result: true
                });
            }
        }

        // If the user doesn't exist or password is incorrect, send a failure response
        return res.send({
            result: false,
            errorMessage: 'The username/email or password was incorrect.'  // Provide an error message
        });
    }
}

module.exports = LoginAPIController;  // Exporting the LoginAPIController to be used in other parts of the application