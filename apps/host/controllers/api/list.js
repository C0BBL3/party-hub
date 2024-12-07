/*
Creates an API Controller for the List screen
Author Colby Roberts
*/
const ListService = require('../../services/list');

class ListAPIController {
    static async getUpcomingParties(req, res) {
        const user = req.session.user;
        const hostId = parseInt(req.params.hostId);

        if (user.id != hostId) {
            return res.send({ result: false });
        }

        const upcoming = await ListService.getUpcomingParties(user.id);

        for (let party of upcoming) {
            let rsvpCount = await ListService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;
        }

        res.send({
            result: true,
            upcoming
        });
    }

    static async getPastParties(req, res) {
        const user = req.session.user;
        const hostId = parseInt(req.params.hostId);

        if (user.id != hostId) {
            return res.send({ result: false });
        }

        const past = await ListService.getPastParties(user.id);

        for (let party of past) {
            let rsvpCount = await ListService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;
        }

        res.send({
            result: true,
            past
        });
    }

    static async getPartyLink(req, res) {
        const user = req.session.user;
        const hostId = parseInt(req.params.hostId);

        if (user.id != hostId) {
            return res.send({ result: false });
        }

        const partyId = parseInt(req.params.partyId);

        const secretKey = await ListService.getPartySecretKey(partyId);

        if (secretKey) {
            const BASE_URL = req.protocol + '://' + req.get('host');
            return res.send({
                result: true,
                link: `${BASE_URL}/party/secret${secretKey}`
            });
        } else {
            return res.send({ result: false });
        }
    }
}

module.exports = ListAPIController;