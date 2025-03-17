/*
Defines the services required by the Feed screen
Author Colby Roberts
*/

const db = require('../../../utils/database');

class FeedService {
    // Fetches the first 10 parties from the database
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

        // If no parties are found, return an empty array
        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            // Map over the rows and extract the party data
            for (let row of result.rows) {
                let party = row.party;
                parties.push(party);
            }

            return parties; // Return the parties
        }
    }

    // Fetches featured parties based on the userId
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
                party.privacy = 'Discoverable'
            LIMIT 
                10;`
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

    // Fetches patrons for a specific party by its partyId
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

        // If no patrons are found, return an empty array
        if (result.rows.length == 0) {
            return [];
        } else {
            let patrons = [];

            // Map over the rows and extract patron data
            for (let row of result.rows) {
                let patron = row.patron;
                patrons.push(patron);
            }

            return patrons; // Return the list of patrons
        }
    }

    // Fetches the RSVP count for a specific party by its partyId
    static async getRSVPCountByPartyId(partyId) {
        const result = await db.execute(`
            SELECT
                partypatronlink.partyId,
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

        // If no RSVP records are found, return 0
        if (result.rows.length == 0) {
            return 0;
        }

        // Return the RSVP count
        return result.rows[0][''].rsvpCount;
    }

    // Fetches the friendship status between two users
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
                );`,
            {
                userOneId,
                userTwoId
            }
        );

        // If no friendship is found, return false
        if (result.rows.length == 0) {
            return false;
        } else {
            // Return the friendship status (active/inactive, etc.)
            return result.rows[0].friend.status;
        }
    }

    // Fetches a specific party by its partyId
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

        // If no party is found, return null
        if (result.rows.length == 0) {
            return null;
        } else {
            // Return the party data
            return result.rows[0].party;
        }
    }
}

module.exports = FeedService;