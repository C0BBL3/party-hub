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

    static async cancel(partyId, patronId) {
        const check = await db.execute(`SELECT id FROM partypatronlink WHERE partyId = [partyId] AND patronId = [patronId];`, { partyId, patronId });

        if (check.rows.length > 0) {
            for (let row of check.rows) {
                await db.update('partypatronlink', { id: row.partypatronlink.id, enabled: 0, secretKey: ''}); // disable all old rsvps between this patron and this party
            }
        }

        return true;
    }

    static async checkStatus(partyId, patronId) {
        const result = await db.execute(`
            SELECT 
                id, 
                enabled 
                
            FROM 
                partypatronlink 
                
            WHERE 
                partyId = [partyId] AND 
                patronId = [patronId]
                
            ORDER BY
                created DESC;`, 
            {
                partyId, 
                patronId 
            }
        );

        if (result.rows.length == 0) {
            return false;
        }
            
        return result.rows[0].partypatronlink;
    }
}

module.exports = RSVPService;