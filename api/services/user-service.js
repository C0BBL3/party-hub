const moment = require('moment');
const db = require('../../utils/database');

class UserService {
    static async getUserById(id) {
        const result = await db.execute(`
            SELECT
                id,
                username,
                firstName,
                lastName,
                isHost,
                isPatron,
                email,
                customerId,
                description,
                tags
                
            FROM
                user
                
            WHERE
                id = [id];`,
            {
                id
            }
        );

        if (result.rows.length !== 1) {
            return null;
        }

        return result.rows[0].user;        
    }

    static async getUserbyEmail(email) {
        const result = await db.execute(`
            SELECT
                id
                
            FROM
                user
                
            WHERE
                email = [email];`,
            {
                email
            }
        );

        if (result.rows.length !== 1) {
            return null;
        }

        return result.rows[0].user.id;        
    }

    static async getUserbyUsername(username) {
        const result = await db.execute(`
            SELECT
                id
                
            FROM
                user
                
            WHERE
                username = [username];`,
            {
                username
            }
        );

        if (result.rows.length !== 1) {
            return null;
        }

        return result.rows[0].user.id;        
    }
}

module.exports = UserService;