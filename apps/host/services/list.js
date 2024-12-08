/*
Defines the services required by the List screen
Author Colby Roberts
*/
const db = require('../../../utils/database');  // Importing the database utility

class ListService {
    // Method to get upcoming parties hosted by a specific user
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
            return [];  // Return an empty array if no upcoming parties are found
        } else {
            let parties = [];
            // Iterate through the result set and construct the party objects
            for (let row of result.rows) {
                let party = row.party;
                party.host = row.host;
                party.address = row.address;
                parties.push(party);  // Add each party to the parties array
            }

            return parties;  // Return the list of upcoming parties
        }
    }

    // Method to get past parties hosted by a specific user
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
            return [];  // Return an empty array if no past parties are found
        } else {
            let parties = [];
            // Iterate through the result set and construct the party objects
            for (let row of result.rows) {
                let party = row.party;
                party.host = row.host;
                party.address = row.address;
                parties.push(party);  // Add each party to the parties array
            }

            return parties;  // Return the list of past parties
        }
    }

    // Method to get the count of RSVPs for a particular party
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
            return 0;  // Return 0 if no RSVPs are found
        }

        return result.rows[0]['rsvpCount'];  // Return the RSVP count for the given party
    }

    // Method to get the secret key for a party, used for accessing private parties
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
            return false;  // Return false if the secret key is not found
        }

        return result.rows[0].party.secretKey;  // Return the secret key for the party
    }
}

module.exports = ListService;  // Export the ListService class for use in other parts of the application