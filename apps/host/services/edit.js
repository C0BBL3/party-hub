/*
Defines the services required by the Edit screen
Author Colby Roberts
*/
const db = require('../../../utils/database');  // Importing the database utility

class EditService {
    // Method to check if a user is the host of a given party
    static async checkIfUserIsHost(partyId, hostId) {
        const result = await db.execute(`
            SELECT 
                party.id
                
            FROM
                party
                
                INNER JOIN partyhostlink ON
                    partyhostlink.partyId = party.id AND
                    partyhostlink.hostId = [hostId]
                    
            WHERE
                party.id = [partyId];`, 
            {
                hostId,
                partyId
            }
        );

        // Return true if the host is associated with the party, otherwise false
        return !result.error && result.rows.length == 1;
    }

    // Method to get party details by its ID
    static async getPartyById(partyId) {
        const result = await db.execute(`
            SELECT
                *
                
            FROM
                party
                
            WHERE
                id = [partyId];`, 
            {
                partyId
            }
        );

        // If no party is found, return null; otherwise, return the party data
        if (result.rows.length == 0) {
            return null;
        } else {
            return result.rows[0].party;
        }
    }

    // Method to update party details
    static async updateParty(partyId, privacy = 'Discoverable', startTime = '', vibes = '', description = '', pictureBase64 = '') {
        const result = await db.update('party', {
            id: partyId, 
            privacy,  // New privacy setting for the party
            startTime,  // New start time for the party
            vibes,  // New vibes or mood description
            description,  // New description for the party
            pictureBase64  // New base64 encoded picture for the party
        });

        // Return true if the update was successful, otherwise false
        return !result.error;
    }
}

module.exports = EditService;  // Export the EditService class for use in other parts of the application