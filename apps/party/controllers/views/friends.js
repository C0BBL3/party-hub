const FriendsService = require('../../services/friends');

class FriendsController {
    static async render(req, res) {
        const user = req.session.user;

        const friends = FriendsService.getFriendsByUserId(user.id);
        const requests = FriendsService.getFriendRequestsByUserId(user.id);

        res.render('friends/friends', {
            section: 'friends',
            user,
            friends,
            requests
        });
    }
}

module.exports = FriendsController;