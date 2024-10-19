class LogoutAPIController {
    static logout(req, res) {
        delete req.session.user;
        res.redirect('/login');
    }
}

module.exports = LogoutAPIController;