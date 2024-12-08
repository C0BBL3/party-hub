/*
Creates an API Controller for the Feed screen
Author Colby Roberts
*/
const FeedService = require('../../services/feed');
const FriendsService = require('../../services/friends');

class FeedAPIController {
    // Fetches the first 10 parties for display
    static async getFirst10Parties(req, res) {
        const parties = await FeedService.getFirst10Parties();

        res.send({
            result: true,
            parties
        });
    }

    // Fetches featured parties for the current user and updates information like RSVP count and friend status
    static async getFeaturedParties(req, res) {
        const user = req.session.user;

        // Get the featured parties for the user
        const parties_ = await FeedService.getFeaturedParties(user.id);
        let parties = [];

        // Loop through each party and add additional details
        for (let party of parties_) {

            // Skip the host's own parties
            if (user.id == party.host.id) {
                continue;
            }

            // Fetch RSVP count for each party
            let rsvpCount = await FeedService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;

            // Check the friendship status with the host
            let status = await FeedService.getFriendStatus(user.id, party.host.id);
            
            if (status == 'accepted') {
                party.discoverability = 2; // Friend
            } else if (status == 'pending') {
                party.discoverability = 1; // Follower
            } else if (status == 'rejected') {
                party.discoverability = -1; // Rejected
            } else {
                party.discoverability = 0; // Neither
            }

            // Fetch the patrons for the party
            let patrons = await FeedService.getPatronsByParty(party.id);

            let friendCount = 0, otherCount = 0;

            // Count the number of friends and followers
            for (let patron of patrons) {
                let status = await FeedService.getFriendStatus(user.id, patron.id);
            
                if (status == 'accepted') {
                    friendCount++; // Friend
                } else if (status == 'pending') {
                    otherCount++; // Follower
                }
            }

            // Add the counts to the party
            party.friendCount = friendCount;
            party.otherCount = otherCount;

            parties.push(party);
        }

        // Sort the parties by friend count, then other count, then RSVP count
        parties.sort((a, b) => {
            if (a.friendCount == b.friendCount) {
                if (a.otherCount == b.otherCount) {
                    return a.rsvpCount - b.rsvpCount;
                }
                return a.otherCount - b.otherCount;
            }
            return a.friendCount - b.friendCount;
        });

        // Reverse the array to sort descending
        parties.reverse();

        res.send({
            result: true,
            parties
        });
    }

    // Allows a user to follow a host (add as a friend)
    static async followHost(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;
         
        // Ensure the user is not trying to follow themselves
        if (user.id != userId) {
            return res.send({
                result: false
            });
        }

        const hostId = req.body.hostId;

        // Add the host as a friend
        const result = await FriendsService.addFriend(userId, hostId);

        res.send({ result });
    }

    // Allows a user to unfollow a host (remove as a friend)
    static async unfollowHost(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;
         
        // Ensure the user is not trying to unfollow themselves
        if (user.id != userId) {
            return res.send({
                result: false
            });
        }

        const hostId = req.body.hostId;

        // Remove the host as a friend
        const result = await FriendsService.removeFriend(userId, hostId);

        res.send({ result });
    }
}

module.exports = FeedAPIController;