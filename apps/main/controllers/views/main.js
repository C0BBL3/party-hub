class MainController {
    static sessionExpired(req, res) {
        res.render('session-expired/session-expired', {
            hideHeaderComplete: true
        });
    }

    static unauthorizedAccess(req, res) {
        res.render('unauthorized-access/unauthorized-access', {
            user: req.session.user
        });
    }

    static render(req, res) {
        res.render('index/index', {
            user: req.session.user
        });
    }
}

module.exports = MainController;