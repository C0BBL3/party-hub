/*
Creates a Controller for the Logout screen
Author Colby Roberts
*/
class LogoutController {
    static render(req, res) {
        delete req.session.user;
        res.redirect('/');
    }
}

module.exports = LogoutController;