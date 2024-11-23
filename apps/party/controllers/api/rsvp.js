const RSVPService = require('../../services/rsvp');

class RSVPAPIController {
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

        const result = await RSVPService.cancel(partyId, patronId);

        return res.send({ result });
    }
}

module.exports = RSVPAPIController;