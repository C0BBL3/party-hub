const db = require('../../../utils/database');

class UserService {
    static async getUserById(id) {
        let result = await db.execute(`
            SELECT
                user.*
            
            FROM
                user 

            WHERE
                user.id = [id];`, 
            { 
                id 
            }
        );

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        return null;
    }

    static async getUserByUsernameOrEmail(usernameOrEmail) {
        const result = await db.execute(`
            SELECT 
                *
            FROM 
                user                  
            WHERE                
                username = [usernameOrEmail] OR
                email = [usernameOrEmail];`,
            {
                usernameOrEmail
            }
        );

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        return null;
    }
}

module.exports = UserService;