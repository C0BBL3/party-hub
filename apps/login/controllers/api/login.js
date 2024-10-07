const LoginService = require('../../services/login');

class LoginAPIController {
    static async login(req, res) { // API
        const usernameOrEmail = req.body.usernameOrEmail;
        const password = req.body.password;
        const user = await LoginService.getUserByUsernameOrEmail(usernameOrEmail);

        if (user && user.password === password) { // if user enters correct temp password
            req.session.user = user;

            await SessionService.insertSession({
                userId: user.id,
                userAgent: req.headers['user-agent']
            });

            return res.send({
                result: true
            });
        } else if (user) { // if user exists
            const result = await LoginService.verifyPassword(password, user.salt, user.hash);

            if (result) {
                await SessionService.insertSession({
                    userId: user.id,
                    userAgent: req.headers['user-agent']
                });

                return res.send({
                    result: true
                });
            }
        }
        
        return res.send({
            result: false,
            errorMessage: 'The username/email or password was incorrect.'
        });
    }
}

module.exports = LoginAPIController;