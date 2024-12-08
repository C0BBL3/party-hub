/*
Defines the services required by the Create screen
Author Colby Roberts
*/
const db = require('../../../utils/database'); // Importing the database utility
const moment = require('moment'); // Importing moment.js to handle date formatting

class CreateService {
    // Method to fetch a party by its title
    static async getPartyByTitle(partyTitle) {
        let result = await db.execute(`
            SELECT
                *
            
            FROM
                party 

            WHERE
                title = [partyTitle];`, 
            { 
                partyTitle
            }
        );

        // If a party is found with the provided title, return the party data
        if (result.rows.length === 1) {
            const row = result.rows[0];
            const party = row.party;
            return party;
        }

        // Return null if no party is found
        return null;
    }

    // Method to create a new party
    static async createParty(title, privacy, startDate, vibes, description, pictureBase64, secretKey) {
        const party = {
            title,  // Party title
            privacy,  // Privacy setting for the party
            startDate: moment(startDate).format('YYYY-MM-DD'),  // Format the start date
            startTime: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),  // Format the start time
            vibes,  // Vibes or mood of the party
            description,  // Description of the party
            pictureBase64,  // Base64 encoded party picture
            secretKey  // Secret key associated with the party (optional)
        };

        // Insert the party into the database and return the inserted party's ID
        let result = await db.insert('party', party);
        return result.rows.insertId;
    }

    // Method to create a new address
    static async createAddress(streetAddress, postalCode, city, state) {
        const address = {
            streetAddress,  // Street address
            postalCode,  // Postal code
            city,  // City
            state  // State
        };

        // Insert the address into the database and return the inserted address's ID
        let result = await db.insert('address', address);
        return result.rows.insertId;
    }

    // Method to link a party to an address
    static async createPartyAddressLink(partyId, addressId) {
        const link = {
            partyId,  // Party ID
            addressId,  // Address ID
            enabled: 1  // Enable the link
        };

        // Insert the link into the database and return the inserted link's ID
        let result = await db.insert('partyaddresslink', link);
        return result.rows.insertId;
    }

    // Method to link an owner (host) to a party
    static async linkOwner(partyId, ownerId) {
        const owner = {
            partyId,  // Party ID
            hostId: ownerId,  // Host ID (owner)
            primaryHost: 1,  // Mark as the primary host
            enabled: 1  // Enable the host link
        };

        // Insert the owner link into the database and return the inserted link's ID
        let result = await db.insert('partyhostlink', owner);
        return result.rows.insertId;
    }

    // Method to delete a party
    static async deleteParty(partyId) {
        await db.remove('party', partyId);  // Remove the party from the database
    }

    // Method to delete an address
    static async deleteAddress(addressId) {
        await db.remove('address', addressId);  // Remove the address from the database
    }

    // Method to delete a party-address link
    static async deletePartyAddressLink(linkId) {
        await db.remove('partyaddresslink', linkId);  // Remove the party-address link from the database
    }
}

module.exports = CreateService;  // Export the CreateService class for use in other parts of the application