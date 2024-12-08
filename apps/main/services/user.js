/*
Defines the services required by the User
Author Colby Roberts
*/
const db = require('../../../utils/database');

class UserService {
    // Fetch a user by their ID
    static async getUserById(id) {
        // Execute SQL query to retrieve the user by their ID
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

        // If a user is found, return the user object
        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        // Return null if no user is found
        return null;
    }

    // Fetch a user by their username or email
    static async getUserByUsernameOrEmail(usernameOrEmail) {
        // Execute SQL query to retrieve the user by either username or email
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

        // If a user is found, return the user object
        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        // Return null if no user is found
        return null;
    }
}

module.exports = UserService;