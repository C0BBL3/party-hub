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

        user.isSupervisorMode = 1;

        req.session.user = user;

        res.redirect('/login');
    }
}

module.exports = LoginController;