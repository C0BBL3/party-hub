const SignupService = require('../../services/signup');

class SignupController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('signup', {
            user
        });
    }
}

module.exports = SignupController;