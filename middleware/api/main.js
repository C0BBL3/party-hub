/*
Creates API for Middleware to use throughout the website
Author Colby Roberts
*/
class APIMiddleware {
    static checkIsAdmin(req, res, next) {
        if(!req.session.user) {
            res.send({
                sessionExpired: true
            });
        } else if (req.session.user && req.session.user.isAdmin) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsAdminOrSupervisorMode(req, res, next) {
        if(!req.session.user) {
            res.send({
                sessionExpired: true
            });
        } else if (req.session.user && (req.session.user.isAdmin || req.session.user.isSupervisorMode)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsPatron(req, res, next) {
        if (req.session.user && (req.session.user.isPatron || req.session.user.isAdmin)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsHost(req, res, next) {
        if (req.session.user && (req.session.user.isHost || req.session.user.isAdmin)) {
            next();
        } else {
            res.redirect('/unauthorized-access');
        }
    }

    static checkIsHostOrPatron(req, res, next) {
        if(!req.session.user) {
            res.send({
                sessionExpired: true
            });
        } else {
            if (req.session.user.isHost || req.session.user.isPatron || req.session.user.isAdmin) {
                next();
            } else {
                res.redirect('/unauthorized-access');
            }
        }
    }

    static checkAuth(req, res, next) {
        if(!req.session.user) {
            res.send({
                sessionExpired: true
            });
        } else if (req.session.user && req.session.user.id) {
            next();
        } else {
            res.redirect('/session-expired');
        }
    }
}

module.exports = APIMiddleware;