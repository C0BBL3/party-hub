/*
Creates an API Controller for the Password screen
Author Colby Roberts
*/

const PasswordService = require('../../services/password');

class PasswordAPIController  {
    // Verifies the password entered by the user
    static async verify(req, res) {
        const password = req.query.password;

        if (!password) {
            return res.send({ result: false });
        }

        const user = req.session.user;
        const userId = req.params.userId;

        // Ensure that the user ID in the session matches the userId in the request
        if (user.id != userId) {
            return res.send({ result: false });
        }

        // Verify the password using PasswordService
        const result = await PasswordService.verifyPassword(password, user.salt, user.hash);

        res.send({ result });
    }

    // Updates the user's password
    static async update(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        // Ensure that the user ID in the session matches the userId in the request
        if (user.id != userId) {
            return res.send({ result: false });
        }

        const password = req.body.password;

        // Update the password using PasswordService
        const result = await PasswordService.updatePassword(userId, password);

        res.send({ result });
    }
}

module.exports = PasswordAPIController;