const EditService = require('../../services/edit');

class EditController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('edit/edit', {
            user
        });
    }
}

module.exports = EditController;