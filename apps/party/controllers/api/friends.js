const { query } = require('express');
const FriendsService = require('../../services/friends');

class FriendsAPIController {
    static async refresh(req, res) {
        const user = req.session.user;
        const userId = req.params.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const friends = await FriendsService.getFriendsByUserId(user.id);

        res.send({
            result: true,
            friends,
        });
    }

    static async requests(req, res) {
        const user = req.session.user;
        const userId = req.params.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const requests = await FriendsService.getFriendRequestsByUserId(user.id);

        res.send({
            result: true,
            requests
        })
    }

    static async search(req, res) {
        const user = req.session.user;
        const search = req.params.search;

        const friends = await FriendsService.searchFriends(user.id, search);

        res.send({
            result: true,
            friends
        });
    }


    static async accept(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const friendId = req.body.friendId;

        const result = await FriendsService.updateStatus(userId, friendId, 'accepted');

        res.send({ result });
    }

    static async reject(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const friendId = req.body.friendId;

        const result = await FriendsService.updateStatus(userId, friendId, 'rejected');

        res.send({ result });
    }

    static async request(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const friendId = req.body.friendId;

        const result = await FriendsService.updateStatus(userId, friendId, 'pending');

        res.send({ result });
    }
   
}

module.exports = FriendsAPIController;