const db = require('../../../utils/database');

class ListService {
    static async getUpcomingParties(userId) {
        let result = await db.execute(`
            SELECT
                party.id, 
                party.startTime,
                party.title,
                party.vibes,
                party.description,
                party.privacy,
                party.pictureBase64,
                host.id,
                host.username,
                host.pictureBase64,
                host.description,
                host.tags,
                count(patron.id) as rsvpCount,
                address.*
                
            FROM
                party

                INNER JOIN partyhostlink ON
                    party.id = partyhostlink.partyId 

                INNER JOIN user as host ON 
                    partyhostlink.hostId = host.id AND
                    partyhostlink.primaryHost = 1 AND
                    partyhostlink.enabled = 1

                INNER JOIN partypatronlink ON
                    party.id = partypatronlink.partyId

                INNER JOIN user as patron ON
                    partypatronlink.patronId = patron.id AND
                    partypatronlink.enabled = 1

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.privacy = 'Discoverable' AND
                party.startTime > NOW() AND
                host.id = [userId]
                
            LIMIT 
                10;`,
            {
                userId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                if (row.party.id == null) { continue;}
                
                let party = row.party;
                party.host = row.host;
                party.rsvpCount = row[''].rsvpCount;
                party.address = row.address;

                parties.push(party);
            }

            return parties;
        }
    }

    static async getPastParties(userId) {
        let result = await db.execute(`
            SELECT
                party.id, 
                party.startTime,
                party.title,
                party.vibes,
                party.description,
                party.privacy,
                party.pictureBase64,
                host.id,
                host.username,
                host.pictureBase64,
                host.description,
                host.tags,
                count(patron.id) as rsvpCount,
                address.*
                
            FROM
                party

                INNER JOIN partyhostlink ON
                    party.id = partyhostlink.partyId 

                INNER JOIN user as host ON 
                    partyhostlink.hostId = host.id AND
                    partyhostlink.primaryHost = 1 AND
                    partyhostlink.enabled = 1

                INNER JOIN partypatronlink ON
                    party.id = partypatronlink.partyId

                INNER JOIN user as patron ON
                    partypatronlink.patronId = patron.id AND
                    partypatronlink.enabled = 1

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.privacy = 'Discoverable' AND
                party.startTime <= NOW() AND
                host.id = [userId]
                
            LIMIT 
                10;`,
            {
                userId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                if (row.party.id == null) { continue;}
                
                let party = row.party;
                party.host = row.host;
                party.rsvpCount = row[''].rsvpCount;
                party.address = row.address;

                parties.push(party);
            }

            return parties;
        }
    }
}

module.exports = ListService;