const SignupService = require('../../services/signup');

class SignupController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('signup/signup', {
            user
        });
    }
}

module.exports = SignupController;