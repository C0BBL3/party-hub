const FeedService = require('../../services/feed');
const RSVPService = require('../../services/rsvp');

class RSVPAPIController {
    static async getUpcomingParties(req, res) {
        const user = req.session.user;
        const patronId = parseInt(req.params.patronId);

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const upcoming = await RSVPService.getUpcomingParties(user.id);

        for (let party of upcoming) {
            let rsvpCount = await RSVPService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;
        }

        res.send({
            result: true,
            upcoming
        });
    }

    static async getPastParties(req, res) {
        const user = req.session.user;
        const patronId = parseInt(req.params.patronId);

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const past = await RSVPService.getPastParties(user.id);

        for (let party of past) {
            let rsvpCount = await RSVPService.getRSVPCountByPartyId(party.id);
            party.rsvpCount = rsvpCount;
        }

        res.send({
            result: true,
            past
        });
    }

    static async rsvp(req, res) {
        const user = req.session.user;
        const { partyId, patronId } = req.body;

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const secretKey = RSVPAPIController.generateSecretKey();

        const rsvpId = await RSVPService.rsvp(partyId, patronId, secretKey);

        return res.send({ result: true });
    }

    static generateSecretKey(length = 32) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // base 36 w/ capital letters
        
        let secretKey = '';

        for (let i = 0; i < length; i++) {
            secretKey += chars[Math.floor(Math.random() * chars.length)];
        }

        return secretKey;
    }

    static async checkStatus(req, res) {
        const user = req.session.user;
        const { partyId, patronId } = req.params;

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const status = await RSVPService.checkStatus(partyId, patronId);

        return res.send({ result: true, enabled: status.enabled });
    }

    static async cancel(req, res) {
        const user = req.session.user;
        const { partyId, patronId } = req.body;

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const party = await FeedService.getParty(partyId);

        const nowUnix = new Date().getTime();
        const partyStartTimeUnix = new Date(party.startTime).getTime();

        if (partyStartTimeUnix < nowUnix) { // can't un-RSVP past events
            return res.send({ result: false });
        }

        const result = await RSVPService.cancel(partyId, patronId);

        return res.send({ result });
    }

    static async getRSVPedParties(req, res) {
        const user = req.session.user;
        const patronId = req.params.patronId;

        if (user.id != patronId) {
            return res.send({ result: false });
        }

        const parties = await RSVPService.getRSVPedParties(patronId);

        return res.send({ result: true, parties });
    }
}

module.exports = RSVPAPIController;