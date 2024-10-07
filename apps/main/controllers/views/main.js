class MainController {
    static sessionExpired(req, res) {
        res.render('session-expired', {
            hideHeaderComplete: true
        });
    }

    static unauthorizedAccess(req, res) {
        res.render('unauthorized-access', {
            user: req.session.user
        });
    }
}

module.exports = MainController;