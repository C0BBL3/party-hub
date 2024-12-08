/*
Creates a Controller for the Logout screen
Author Colby Roberts
*/
class LogoutController {
    // This method handles the logout process
    static render(req, res) {
        // Delete the user from the session, effectively logging them out
        delete req.session.user;

        // Redirect the user to the home page (or any other designated page after logging out)
        res.redirect('/');  // Redirect to the root (home) page
    }
}

module.exports = LogoutController;  // Export the LogoutController for use in other parts of the application