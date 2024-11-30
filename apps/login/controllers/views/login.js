const LoginService = require('../../services/login');

class LoginController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('login/login', {
            user
        });
    }

    static async loginuser(req, res) {
        const id = req.params.id;

        const user = await LoginService.getUserById(id);

        if (user.isAdmin) {
            user.isSupervisorMode = 1;
        }

        req.session.user = user;
        req.session.x = 7;

        setTimeout(() => { res.redirect('/party/feed'); }, 1000);
    }
}

module.exports = LoginController;