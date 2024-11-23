const RSVPService = require('../../services/rsvp');

class RSVPAPIController {
    static async rsvp(req, res) {
        const user = req.session.user;
        const { partyId, userId } = req.body;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        const secretKey = RSVPAPIController.generateSecretKey();

        const rsvpId = await RSVPService.rsvp(partyId, userId, secretKey);

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
}

module.exports = RSVPAPIController;