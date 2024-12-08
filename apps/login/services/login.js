/*
Defines the services required by the Login screen
Author Colby Roberts
*/
const db = require('../../../utils/database'); // Import the database utility module
const crypto = require('crypto'); // Import the built-in crypto module
const scryptAsync = require('scrypt-async'); // Import the scrypt-async library for password hashing

class LoginService {
    // Retrieves a user by their username or email.
    static async getUserByUsernameOrEmail(usernameOrEmail) {
        // Execute a database query to find the user by username or email
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

        // If a single user is found, return the user object
        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;
            return user;
        }

        // If no user is found, return null
        return null;
    }

    // Retrieves a user by their ID.
    static async getUserById(id) {
        // Execute a database query to find the user by ID
        const result = await db.execute(`
            SELECT 
                * 
            FROM 
                user 
            WHERE 
                id = [id];`,
            {
                id
            }
        );

        // If a single user is found, return the user object
        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;
            return user;
        }

        // If no user is found, return null
        return null;
    }

    // Verifies a password by comparing it to a saved hash using the scrypt algorithm.
    static async verifyPassword(password, salt, savedHash) {
        // Configuration options for the scrypt algorithm
        const options = {
            logN: 11, // Cost factor
            r: 8,     // Block size
            encoding: 'hex' // Output encoding
        };

        // Return a Promise to handle asynchronous password verification
        return new Promise((resolve, reject) => {
            scryptAsync(password, salt, options, function(hash) {
                // Compare the generated hash with the saved hash
                let verified = (hash === savedHash);
                resolve(verified); // Resolve the Promise with the verification result
            });
        });
    }
}

module.exports = LoginService; // Export the LoginService class for external use
