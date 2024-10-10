const ViewService = require('../../services/view');

class ViewController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('view/view', {
            user
        });
    }
}

module.exports = ViewController;