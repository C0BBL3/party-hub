/*
Creates an API Controller for the Password screen
Author Colby Roberts
*/
const PasswordService = require('../../services/password');

class PasswordAPIController  {
    static async verify(req, res) { // API
        const password = req.query.password;

        if (!password) {
            return res.send({ result: false });
        }

        const user = req.session.user;
        const userId = req.params.userId;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        const result = await PasswordService.verifyPassword(password, user.salt, user.hash);

        res.send({ result });
    }

    static async update(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        const password = req.body.password;

        const result = await PasswordService.updatePassword(userId, password);

        res.send({ result });
    }
}

module.exports = PasswordAPIController;