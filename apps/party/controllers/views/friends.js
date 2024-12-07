/*
Creates a Controller for the Friends screen
Author Colby Roberts
*/
const FriendsService = require('../../services/friends');

class FriendsController {
    static async render(req, res) {
        const user = req.session.user;

        const friends = await FriendsService.getFriendsByUserId(user.id);
        const requests = await FriendsService.getFriendRequestsByUserId(user.id);

        res.render('friends/friends', {
            section: 'friends',
            user,
            friends,
            requests
        });
    }
}

module.exports = FriendsController;