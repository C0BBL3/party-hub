const db = require('../../../utils/database');

class FeedService {
    static async getFirst10Parties() {
        let result = await db.execute(`
            SELECT
                id,
                startTime,
                title,
                vibes,
                description
                
            FROM
                party
                
            LIMIT 
                10;`
            );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                let party = row.party;

                parties.push(party);
            }

            return parties;
        }
    }

    static async getParty(partyId) {
        let result = await db.execute(`
            SELECT
                id,
                startTime,
                title,
                vibes,
                description
                
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
}

module.exports = FeedService;