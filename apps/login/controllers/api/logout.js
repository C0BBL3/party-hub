/*
Creates an API Controller for the Logout route
Author Colby Roberts
*/
class LogoutAPIController {
    // The logout method handles logging out the user and redirecting them to the login page
    static logout(req, res) {
        // Remove the user from the session to log them out
        delete req.session.user;

        // Redirect the user to the login page
        res.redirect('/login');
    }
}

module.exports = LogoutAPIController;  // Exporting the LogoutAPIController to be used in other parts of the application