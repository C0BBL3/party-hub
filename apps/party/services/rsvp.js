/*
Defines the services required by the Friends screen
Author Colby Roberts
*/
const db = require('../../../utils/database');

class RSVPService {
    static async getUpcomingParties(patronId) {
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

                INNER JOIN partypatronlink ON
                    party.id = partypatronlink.partyId

                INNER JOIN user as patron ON
                    partypatronlink.patronId = patron.id AND
                    partypatronlink.enabled = 1 AND
                    patron.id = [patronId]

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.startTime > NOW()
                
            ORDER BY
                startTime DESC;`,
            {
                patronId
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

    static async getPastParties(patronId) {
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

                INNER JOIN partypatronlink ON
                    party.id = partypatronlink.partyId

                INNER JOIN user as patron ON
                    partypatronlink.patronId = patron.id AND
                    partypatronlink.enabled = 1 AND
                    patron.id = [patronId]

                INNER JOIN partyaddresslink ON
                    party.id = partyaddresslink.partyId

                INNER JOIN address ON
                    partyaddresslink.addressId = address.id AND
                    partyaddresslink.enabled = 1

            WHERE
                party.startTime <= NOW()
                
            ORDER BY
                startTime DESC;`,
            {
                patronId
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

    static async rsvp(partyId, patronId, secretKey) {
        const check = await db.execute(`SELECT id FROM partypatronlink WHERE partyId = [partyId] AND patronId = [patronId];`, { partyId, patronId });

        if (check.rows.length > 0) {
            for (let row of check.rows) {
                await db.update('partypatronlink', { id: row.partypatronlink.id, enabled: 0, secretKey: ''}); // disable all old rsvps between this patron and this party
            }
        }

        const result = await db.insert('partypatronlink', { partyId, patronId, enabled: 1, secretKey });

        return result.rows.insertId;
    }

    static async cancel(partyId, patronId) {
        const check = await db.execute(`SELECT id FROM partypatronlink WHERE partyId = [partyId] AND patronId = [patronId];`, { partyId, patronId });

        if (check.rows.length > 0) {
            for (let row of check.rows) {
                await db.update('partypatronlink', { id: row.partypatronlink.id, enabled: 0, secretKey: ''}); // disable all old rsvps between this patron and this party
            }
        }

        return true;
    }

    static async checkStatus(partyId, patronId) {
        const result = await db.execute(`
            SELECT 
                id, 
                enabled
                
            FROM 
                partypatronlink 
                
            WHERE 
                partyId = [partyId] AND 
                patronId = [patronId]
                
            ORDER BY
                created DESC;`, 
            {
                partyId, 
                patronId 
            }
        );

        if (result.rows.length == 0) {
            return false;
        }
            
        return result.rows[0].partypatronlink;
    }

    static async getRSVPedParties(patronId) {
        const result = await db.execute(`
            SELECT
                party.id,
                party.startTime,
                party.title,
                party.vibes,
                party.description

            FROM
                partypatronlink
                
                INNER JOIN party ON
                    partypatronlink.partyId = party.id AND
                    partypatronlink.patronId = [patronId] AND
                    partypatronlink.enabled = 1;`,
            {
                patronId
            }
        );

        if (result.rows.length == 0) {
            return [];
        } else {
            let parties = [];

            for (let row of result.rows) {
                // if (row.party.id == null) { continue; }
                let party = row.party;
                parties.push(party);
            }

            return parties;
        }
    }
}

module.exports = RSVPService;