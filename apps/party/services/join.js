/*
Defines the services required by the Join screen
Author Colby Roberts
*/

const db = require('../../../utils/database');

class JoinService {
    // Retrieves a party's details by partyId and patronId
    static async getParty(partyId, patronId) {
        const result = await db.execute(`
            SELECT
                party.id,
                party.title,
                party.privacy,
                host.id,
                host.username
            FROM
                party

                INNER JOIN partyhostlink ON
                    party.id = partyhostlink.partyId

                INNER JOIN user as host ON
                    host.id = partyhostlink.hostId AND
                    partyhostlink.enabled = 1

            WHERE
                party.startTime > NOW() AND
                party.id = [partyId];`,
            {
                partyId
            }
        );

        if (result.error || result.rows.length == 0) {
            return null; // Return null if party not found or query error
        }

        return { party: result.rows[0].party, host: result.rows[0].host }; // Return party and host details
    }

    // Retrieves a party's details by its secretKey
    static async getPartyBySecretKey(secretKey) {
        const result = await db.execute(`
            SELECT
                id,
                title,
                pictureBase64,
                description,
                vibes
            FROM
                party
            WHERE
                secretKey = [secretKey] AND
                startTime > NOW();`,
            {
                secretKey
            }
        );

        if (result.error || result.rows.length == 0) {
            return null; // Return null if party not found or query error
        }

        return result.rows[0].party; // Return party details
    }
}

module.exports = JoinService;