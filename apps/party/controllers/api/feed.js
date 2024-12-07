/*
Creates an API Controller for the Feed screen
Author Colby Roberts
*/
const FeedService = require('../../services/feed');
const FriendsService = require('../../services/friends');

class FeedAPIController {
    static async getFirst10Parties(req, res) {
        const parties = await FeedService.getFirst10Parties();

        res.send({
            result: true,
            parties
        });
    }

    static async getFeaturedParties(req, res) {
        const user = req.session.user;

        const parties_ = await FeedService.getFeaturedParties(user.id);
        let parties = [];


        for (let party of parties_) {

            if (user.id == party.host.id) {
                continue;
            }

            let rsvpCount = await FeedService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;

            let status = await FeedService.getFriendStatus(user.id, party.host.id);
            
            if (status == 'accepted') {
                party.discoverability = 2; // friend
            } else if (status == 'pending') {
                party.discoverability = 1; // follower
            } else if (status == 'rejected') {
                party.discoverability = -1 // rejected
            } else {
                party.discoverability = 0; // neither
            }

            let patrons = await FeedService.getPatronsByParty(party.id);

            let friendCount, otherCount = 0;

            for (let patron of patrons) {
                let status = await FeedService.getFriendStatus(user.id, patron.id);
            
                if (status == 'accepted') {
                    friendCount++; // friend
                } else if (status == 'pending') {
                    otherCount++; // follower
                }
            }

            party.friendCount = friendCount;
            party.otherCount = otherCount;

            parties.push(party);
        }

        parties.sort((a, b) => {
            if (a.friendCount == b.friendCount) {
                if (a.otherCount == b.otherCount) {
                    return a.rsvpCount - b.rsvpCount;
                }
                    
                return a.otherCount - b.otherCount;
            }
                
            return a.friendCount - b.friendCount;
        }); // sort ascending

        parties.reverse(); // sort descending
        
        res.send({
            result: true,
            parties
        });
    }

    static async followHost(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;
         
        if (user.id != userId) {
            return res.send({
                result: false
            });
        }

        const hostId = req.body.hostId;

        const result = await FriendsService.addFriend(userId, hostId);

        res.send({ result });
    }

    static async unfollowHost(req, res) {
        const user = req.session.user;
        const userId = req.body.userId;
         
        if (user.id != userId) {
            return res.send({
                result: false
            });
        }

        const hostId = req.body.hostId;

        const result = await FriendsService.removeFriend(userId, hostId);

        res.send({ result });
    }
}

module.exports = FeedAPIController;