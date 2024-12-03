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
        }
    }

    static async getFeaturedParties(userId) {
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
                
            LIMIT 
                10;`
            );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                if (row.party.id == null) { continue;}
                
                let party = row.party;
                party.host = row.host;
                party.address = row.address;

                parties.push(party);
            }

            return parties;
        }
    }

    static async getPatronsByParty(partyId) {
        const result = await db.execute(`
            SELECT
                patron.id,
                patron.username

            FROM
                user as patron

                INNER JOIN partypatronlink ON
                    partypatronlink.patronId = patron.id

                INNER JOIN party ON
                    party.id = partypatronlink.partyId
                
            WHERE
                party.id = [partyId];`,
            {
                partyId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let patrons = [];

            for (let row of result.rows) {
                let patron = row.patron;

                patrons.push(patron);
            }

            return patrons;
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

    static async getFriendStatus(userOneId, userTwoId) {
        const result = await db.execute(`
            SELECT
                status
                
            FROM
                friend
                
            WHERE
                (
                    (
                        userOneId = [userOneId] AND
                        userTwoId = [userTwoId]
                    ) OR
                    (
                        userOneId = [userTwoId] AND
                        userTwoId = [userOneId]
                    )
                ) AND 
                status != 'rejected';`,
            {
                userOneId,
                userTwoId
            }
        );

        if (result.rows.length == 0) {
            return false;
        } else {
            return result.rows[0].friend.status;
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