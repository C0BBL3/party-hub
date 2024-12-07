/*
Creates a Controller for the Create screen
Author Colby Roberts
*/
const CreateService = require('../../services/create');

class CreateController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('create/create', {
            user,
            section: 'create'
        });
    }
}

module.exports = CreateController;