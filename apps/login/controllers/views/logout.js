class LogoutController {
    static render(req, res) {
        delete req.session.user;
        res.redirect('/');
    }
}

module.exports = LogoutController;