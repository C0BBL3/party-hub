/*
Creates an API Controller for the Feed screen
Author Colby Roberts
*/
const FriendsService = require('../../services/friends');
const JoinService = require('../../services/join');

class JoinAPIController {
    // Fetches a party based on partyId and patronId, ensuring the user has the right to view the party.
    static async getParty(req, res) {
        const user = req.session.user; // Get the user from the session
        const patronId = parseInt(req.params.patronId); // The patron (user) ID from the URL

        // Check if the logged-in user is the same as the patronId (ensuring user data privacy)
        if (user.id != patronId) {
            return res.send({
                result: false // User is trying to access a different patron's data
            });
        }

        const partyId = parseInt(req.params.partyId); // Extract the partyId from the URL

        // Fetch the party information from the JoinService
        const party = await JoinService.getParty(partyId, patronId);

        // If no party is found, return a failure response
        if (party == null) {
            return res.send({ result: false });
        }

        // If the party is not private, send back the party details
        if (party.party.privacy != 'Private') {
            return res.send({ 
                result: true,
                party: party.party
            });
        }

        // If the party is private, check if the user is friends with the host
        let status = await FriendsService.checkIfFriend(patronId, party.host.id);

        // If the user is not a friend of the host, they cannot join the private party
        if (!status) {
            return res.send({ result: false });
        }

        // If the user is a friend of the host, send back the party details
        return res.send({
            result: true,
            party: party.party
        });
    }
}

module.exports = JoinAPIController;