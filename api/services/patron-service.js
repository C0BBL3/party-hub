const moment = require('moment');
const db = require('../../utils/database');

class PatronService {
    static async getPatronInfo(userId) {
        const result = await db.execute(`
            SELECT
                id,
                created,
                firstName,
                lastName,
                username,
                email,
                isHost
                                
            FROM 
                user as patron

            WHERE
                id = [patronId];`,
            {
                patronId: userId
            }
        );
        
        if (result.rows.length == 0) {
            return {};
        }

        const patron = result.rows[0].patron;
        patron.parties = [];

        return patron;
    }
}

module.exports = PatronService;