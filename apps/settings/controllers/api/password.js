const PasswordService = require('../../services/password');

class PasswordAPIController  {
    static async update(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const password = body.password;

        const result = await PasswordService.updatePassword(userId, password);

        if (result) {  
            res.send({
                result: true
            });
        } else {
            res.send({
                result: false
            });
        }
    }
}

module.exports = PasswordAPIController;