/*
Creates an API Controller for the Friends screen
Author Colby Roberts
*/
const { query } = require('express');
const FriendsService = require('../../services/friends');

class FriendsAPIController {
    static async friends(req, res) {
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

        const patrons = await FriendsService.searchForFriend(user.id, search);

        res.send({
            result: true,
            patrons
        });
    }

    static async remove(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        if (user.id != userId) {
            return res.send({
                result: false,
            })
        }

        const friendId = req.body.friendId;

        const result = await FriendsService.removeFriend(userId, friendId);

        res.send({ result });
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

        const status1 = await FriendsService.checkIfPending(userId, friendId);

        if (status1) { // already pending
            return res.send({ result: false, pending: true });
        }

        const status2 = await FriendsService.checkIfPending(friendId, userId);

        let result;
        if (status2) { // if other user requested to be friend of current user
            result = await FriendsService.updateStatus(userId, friendId, 'accepted'); // make friends
        } else {
            result = await FriendsService.addFriend(userId, friendId); // otherwise request
        }

        res.send({ result, pending: false });
    }
   
}

module.exports = FriendsAPIController;