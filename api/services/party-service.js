const moment = require('moment');
const db = require('../../utils/database');

class PartyService {
    static async getCurrentHostParties(hostId) {
        const result = await db.execute(`
            SELECT
                party.id,
                party.title,
                attending.rsvpCount
                
            FROM
                party

                LEFT JOIN partyhostlink ON
                    partyhostlink.partyId = party.id AND
                    partyhostlink.hostId = [hostId]
                
                LEFT JOIN (
                    SELECT
                        partypatronlink.partyId as partyId,
                        count(patron.id) as rsvpCount
                    FROM
                        user AS patron
                        
                        INNER JOIN partypatronlink ON
                            partypatronlink.patronId = patron.id AND
                            partypatronlink.enabled = 1

                    GROUP BY
                        partypatronlink.partyId
                ) as attending ON
                    attending.partyId = party.id;`,
            {
                hostId
            }
        );

        if (result.rows.length == 0) {
            return [];
        }

        let parties = [];

        for (let row of result.rows) {
            const party = row.party;

            party.rsvp = row.attending.rsvp;
            party.capacity = 50;

            parties.push(party);
        }

        return parties;
    }

    static async getCurrentPatronParties(patronId) {
        const result = await db.execute(`
            SELECT
                party.id,
                party.title,
                partyhostlink.hostId,
                attending.rsvpCount
                
            FROM
                party

                LEFT JOIN partypatronlink ON
                    partypatronlink.partyId = party.id AND
                    partypatronlink.patronId = [patronId]

                LEFT JOIN partyhostlink ON
                    partyhostlink.partyId = party.id 
                
                LEFT JOIN (
                    SELECT
                        partypatronlink.partyId as partyId,
                        count(patron.id) as rsvpCount
                    FROM
                        user AS patron
                        
                        INNER JOIN partypatronlink ON
                            partypatronlink.patronId = patron.id AND
                            partypatronlink.enabled = 1
                    
                GROUP BY
                    partypatronlink.partyId
                ) as attending ON
                    attending.partyId = party.id;`,
            {
                patronId
            }
        );

        if (result.rows.length == 0) {
            return [];
        }

        let parties = [];

        for (let row of result.rows) {
            const party = row.party;

            party.hostId = row.partyhostlink.hostId;
            party.rsvp = row.attending.rsvp;
            party.capacity = 50;

            parties.push(party);
        }

        return parties;
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

            WHERE
                party.startTime >= NOW() AND
                party.privacy = 'Discoverable';`
        );

        // If no featured parties are found, return an empty array
        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            // Map over the rows and build the party data, including host and address information
            for (let row of result.rows) {
                if (row.party.id == null) { continue;}
                let party = row.party;
                party.host = row.host;
                party.address = row.address;
                parties.push(party);
            }

            return parties; // Return the featured parties
        }
    }

    static async getPartyTitleById(partyId) {
        const result = await db.execute(`
            SELECT
                id,    
                title
                
            FROM
                party
                
            WHERE
                id = [partyId];`,
            {
                partyId
            }
        );

        if (result.rows.length === 1) {
            return result.rows[0].party.title;
        } else {
            return null;
        }
    }
}

module.exports = PartyService;