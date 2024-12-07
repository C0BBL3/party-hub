/*
Creates Middleware class for functions to be used throughout the website
Author Colby Roberts
*/
class Middleware {
    static checkIsAdmin(req, res, next) {
        if (!req.session.user) {
            res.redirect('/session-expired');
        } else if (req.session.user && req.session.user.isAdmin) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsPatron(req, res, next) {
        if (!req.session.user) {
            res.redirect('/session-expired');
        } else if (req.session.user && (req.session.user.isPatron || req.session.user.isAdmin)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsHost(req, res, next) {
        if (!req.session.user) {
            res.redirect('/session-expired');
        } else if (req.session.user && (req.session.user.isHost || req.session.user.isAdmin)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsHostOrPatron(req, res, next) {
        if (!req.session.user) {
            res.redirect('/session-expired');
        } else if (req.session.user && (req.session.user.isHost || req.session.user.isPatron || req.session.user.isAdmin)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkAuth(req, res, next) {
        if (!req.session.user) {
            res.redirect('/session-expired');
        } else if (req.session.user && req.session.user.id) {
            next();
        } else {
            res.redirect('/session-expired');
        }
    }

    static checkGuestAuth(req, res, next) {
        next();
    }
}

module.exports = Middleware;