const CreateService = require('../../services/create');

class CreateController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('create/create', {
            user
        });
    }
}

module.exports = CreateController;