/*
Defines the services required by the Edit screen
Author Colby Roberts
*/
const db = require('../../../utils/database');

class EditService {
    static async checkIfUserIsHost(partyId, hostId) {
        const result = await db.execute(`
            SELECT 
                party.id
                
            FROM
                party
                
                INNER JOIN partyhostlink ON
                    partyhostlink.partyId = party.id AND
                    partyhostlink.hostId = [hostId]
                    
            WHERE
                party.id = [partyId];`,
            {
                hostId,
                partyId
            }
        );

        return !result.error && result.rows.length == 1;
    }

    static async getPartyById(partyId) {
        const result = await db.execute(`
            SELECT
                *
                
            FROM
                party
                
            WHERE
                id = [partyId];`,
            {
                partyId
            }
        );

        if (result.rows.length == 0) {
            return null;
        } else {
            return result.rows[0].party;
        }
    }

    static async updateParty(partyId, privacy = 'Discoverable', startTime = '', vibes = '', description = '', pictureBase64 = '') {
        const result = await db.update('party', {
            id: partyId,
            privacy, 
            startTime, 
            vibes, 
            description,
            pictureBase64
        });

        return !result.error;
    }
}

module.exports = EditService;