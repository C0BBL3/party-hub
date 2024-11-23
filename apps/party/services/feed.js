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
}

module.exports = FeedService;