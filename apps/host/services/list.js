/*
Defines the services required by the List screen
Author Colby Roberts
*/
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
                address.*
                
            FROM
                party

                INNER JOIN partyhostlink ON
                    party.id = partyhostlink.partyId 

                INNER JOIN user as host ON 
                    partyhostlink.hostId = host.id AND
                    partyhostlink.primaryHost = 1 AND
                    partyhostlink.enabled = 1

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.startTime > NOW() AND
                host.id = [userId]
                
            ORDER BY
                startTime DESC;`,
            {
                userId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                let party = row.party;
                party.host = row.host;
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
                address.*
                
            FROM
                party

                INNER JOIN partyhostlink ON
                    party.id = partyhostlink.partyId 

                INNER JOIN user as host ON 
                    partyhostlink.hostId = host.id AND
                    partyhostlink.primaryHost = 1 AND
                    partyhostlink.enabled = 1

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.startTime <= NOW() AND
                host.id = [userId]
                
            ORDER BY
                startTime DESC;`,
            {
                userId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {                
                let party = row.party;
                party.host = row.host;
                party.address = row.address;

                parties.push(party);
            }

            return parties;
        }
    }

    static async getRSVPCountByPartyId(partyId) {
        const result = await db.execute(`
            SELECT
                count(patron.id) as rsvpCount
                
            FROM
                user AS patron
                
                INNER JOIN partypatronlink ON
                    partypatronlink.patronId = patron.id AND
                    partypatronlink.enabled = 1
                    
            WHERE
                partypatronlink.partyId = [partyId];`,
            {
                partyId
            }
        );

        if (result.rows.length == 0) {
            return 0;
        }

        return result.rows[0][''].rsvpCount;
    }

    static async getPartySecretKey(partyId) {
        const result = await db.execute(`
            SELECT
                secretKey
                
            FROM
                party
                
            WHERE
                id = [partyId]`,
            {
                partyId
            }
        );

        if (result.rows.length == 0) {
            return false;
        }

        return result.rows[0].party.secretKey;
    }
}

module.exports = ListService;