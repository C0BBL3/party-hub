/*
Creates an API Controller for the Feed screen
Author Colby Roberts
*/
const FriendsService = require('../../services/friends');
const JoinService = require('../../services/join');

class JoinAPIController {
    static async getParty(req, res) {
        const user = req.session.user;
        const patronId = parseInt(req.params.patronId);
         
        if (user.id != patronId) {
            return res.send({
                result: false
            });
        }

        const partyId = parseInt(req.params.partyId);

        const party = await JoinService.getParty(partyId, patronId);

        if (party == null ) {
            return res.send({ result: false });
        }

        if (party.party.privacy != 'Private') {
            return res.send({ 
                result: true,
                party: party.party
            });
        }

        let status = await FriendsService.checkIfFriend(patronId, party.host.id);

        if (!status) {
            return res.send({ result: false });
        }

        return res.send({
            result: true,
            party: party.party
        });
    }
}

module.exports = JoinAPIController;