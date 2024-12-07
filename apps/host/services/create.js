/*
Defines the services required by the Create screen
Author Colby Roberts
*/
const db = require('../../../utils/database');
const moment = require('moment');

class CreateService {
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

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const party = row.party;

            return party;
        }

        return null;
    }

    static async createParty(title, privacy, startDate, vibes, description, pictureBase64, secretKey) {
        const party = {
            title, 
            privacy, 
            startDate: moment(startDate).format('YYYY-MM-DD'),
            startTime: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
            vibes, 
            description, 
            pictureBase64,
            secretKey
        };

        let result = await db.insert('party', party);
        return result.rows.insertId;
        
    }

    static async createAddress(streetAddress, postalCode, city, state) {
        const address = {
            streetAddress,
            postalCode,
            city,
            state
        };

        let result = await db.insert('address', address);
        return result.rows.insertId;
    }

    static async createPartyAddressLink(partyId, addressId) {
        const link = {
            partyId,
            addressId,
            enabled: 1
        };

        let result = await db.insert('partyaddresslink', link);
        return result.rows.insertId;
    }

    static async linkOwner(partyId, ownerId) {
        const owner = {
            partyId,
            hostId: ownerId,
            primaryHost: 1,
            enabled: 1
        };

        let result = await db.insert('partyhostlink', owner);
        return result.rows.insertId;
    }

    static async deleteParty(partyId) {
        await db.remove('party', partyId);
    }

    static async deleteAddress(addressId) {
        await db.remove('address', addressId);
    }

    static async deletePartyAddressLink(linkId) {
        await db.remove('partyaddresslink', linkId);
    }
}

module.exports = CreateService;