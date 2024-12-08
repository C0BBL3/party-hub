/*
Creates an API Controller for the Friends screen
Author Colby Roberts
*/
const { query } = require('express');
const FriendsService = require('../../services/friends');

class FriendsAPIController {
    // Fetches a list of friends for the specified user
    static async friends(req, res) {
        const user = req.session.user;
        const userId = req.params.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        // Fetch friends of the user
        const friends = await FriendsService.getFriendsByUserId(user.id);

        res.send({
            result: true,
            friends,
        });
    }

    // Fetches a list of pending friend requests for the specified user
    static async requests(req, res) {
        const user = req.session.user;
        const userId = req.params.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        // Fetch pending friend requests
        const requests = await FriendsService.getFriendRequestsByUserId(user.id);

        res.send({
            result: true,
            requests
        });
    }

    // Allows searching for patrons (potential friends) by their username or email
    static async search(req, res) {
        const user = req.session.user;
        const search = req.params.search;

        // Perform a search to find users matching the search term
        const patrons = await FriendsService.searchForFriend(user.id, search);

        res.send({
            result: true,
            patrons
        });
    }

    // Removes a friend connection between the authenticated user and the given friend
    static async remove(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        const friendId = req.body.friendId;

        // Remove the friend
        const result = await FriendsService.removeFriend(userId, friendId);

        res.send({ result });
    }

    // Accepts a friend request from the specified friend
    static async accept(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        const friendId = req.body.friendId;

        // Accept the friend request and update the status
        const result = await FriendsService.updateStatus(userId, friendId, 'accepted');

        res.send({ result });
    }

    // Rejects a friend request from the specified friend
    static async reject(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        const friendId = req.body.friendId;

        // Reject the friend request and update the status
        const result = await FriendsService.updateStatus(userId, friendId, 'rejected');

        res.send({ result });
    }

    // Sends a friend request from one user to another, or accepts it if already pending
    static async request(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;

        // Ensure the request is for the authenticated user's data
        if (user.id != userId) {
            return res.send({
                result: false,
            });
        }

        const friendId = req.body.friendId;

        // Check if there's already a pending request from the current user to the friend
        const status1 = await FriendsService.checkIfPending(userId, friendId);

        if (status1) { // If the request is already pending
            return res.send({ result: false, pending: true });
        }

        // Check if the friend has already requested the current user
        const status2 = await FriendsService.checkIfPending(friendId, userId);

        let result;
        if (status2) { // If the other user has requested to be friends, accept the request
            result = await FriendsService.updateStatus(userId, friendId, 'accepted');
        } else { // Otherwise, send a friend request
            result = await FriendsService.addFriend(userId, friendId);
        }

        res.send({ result, pending: false });
    }
}

module.exports = FriendsAPIController;