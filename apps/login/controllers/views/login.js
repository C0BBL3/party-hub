const LoginService = require('../../services/login');

class LoginController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('login', {
            user
        });
    }
}

module.exports = LoginController;