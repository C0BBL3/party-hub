const FriendsService = require('../../services/friends');

class FriendsController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('friends', {
            section: 'friends',
            user
        });
    }
}

module.exports = FriendsController;