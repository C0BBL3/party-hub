const ListService = require('../../services/list');

class ListController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('list/list', {
            section: 'list',
            user
        });
    }
}

module.exports = ListController;