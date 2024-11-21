const db = require('../../../utils/database');

class FeedService {
    static async getFirst10Parties() {
        let result = await db.execute(`
            SELECT
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
                let party = {
                    title: row.party.title,
                    vibes: row.party.vibes,
                    description: row.party.description,
                    startTime: row.party.startTime
                };

                parties.push(party);
            }

            return parties;
        }
    }
}

module.exports = FeedService;