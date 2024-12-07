/*
Creates an API Controller for the Logout route
Author Colby Roberts
*/
class LogoutAPIController {
    static logout(req, res) {
        delete req.session.user;
        res.redirect('/login');
    }
}

module.exports = LogoutAPIController;