const db = require('../../../utils/database');

class RSVPService {
    static async rsvp(partyId, patronId, secretKey) {
        const check = await db.execute(`SELECT id FROM partypatronlink WHERE partyId = [partyId] AND patronId = [patronId];`, { partyId, patronId });

        if (check.rows.length > 0) {
            for (let row of check.rows) {
                await db.update('partypatronlink', { id: row.partypatronlink.id, enabled: 0, secretKey: ''}); // disable all old rsvps between this patron and this party
            }
        }

        const result = await db.insert('partypatronlink', { partyId, patronId, enabled: 1, secretKey });

        return result.rows.insertId;
    }
}

module.exports = RSVPService;