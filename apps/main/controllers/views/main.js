/*
Creates a Controller for the Main screen
Author Colby Roberts
*/
class MainController {
    // Renders the session expired page
    static sessionExpired(req, res) {
        res.render('session-expired/session-expired', {
            user: null, // No user session available
            hideHeaderComplete: true // Hide the complete header on this page
        });
    }

    // Renders the unauthorized access page
    static unauthorizedAccess(req, res) {
        res.render('unauthorized-access/unauthorized-access', {
            user: req.session.user // Pass the current user session, if available
        });
    }

    // Renders the main index page
    static render(req, res) {
        res.render('index/index', {
            user: req.session.user // Pass the current user session for personalization
        });
    }
}

module.exports = MainController; // Export the controller for use in routing