/*
Defines the services required by the Signup screen
Author Colby Roberts
*/
const db = require('../../../utils/database'); // Import the database utility module
const crypto = require('crypto'); // Import the built-in crypto module
const scryptAsync = require('scrypt-async'); // Import the scrypt-async library for password hashing

class SignupService {
    
    // Generates a random alphanumeric password of the specified length.
    static generatePassword(length = 8) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Character set for password
        let result = '';

        // Randomly select characters to construct the password
        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
    }

    
    // Hashes a password using the scrypt algorithm and generates a salt.
    static async hashPassword(password = null) {
        const options = {
            logN: 11, // Cost factor
            r: 8,     // Block size
            encoding: 'hex' // Output encoding
        };

        // Return a Promise to handle asynchronous password hashing
        return new Promise((resolve, reject) => {
            let salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
            
            scryptAsync(password, salt, options, function(hash) {
                resolve({
                    salt: salt, // Generated salt
                    hash: hash  // Hashed password
                });
            });
        });
    }

    
    // Creates a new host account in the database.
    static async createHostAccount(host) {
        host.isHost = 1; // Mark the account as a host
        let result = await db.insert('user', host); // Insert the host account into the database

        return result.rows.insertId; // Return the ID of the newly created host account
    }

    
    // Creates a new patron account in the database.
    static async createPatronAccount(patron) {
        patron.isPatron = 1; // Mark the account as a patron
        let result = await db.insert('user', patron); // Insert the patron account into the database

        return result.rows.insertId; // Return the ID of the newly created patron account
    }

    
    // Retrieves a user by their ID.
    static async getUserById(id) {
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

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        return null;
    }

    
    // Retrieves a user by their username.
    static async getUserByUsername(username) {
        let result = await db.execute(`
            SELECT 
                * 
            FROM 
                user 
            WHERE 
                username = [username];`,
            { 
                username
            }
        );

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        return null;
    }

    // Retrieves a user by their email.
    static async getUserByEmail(email) {
        let result = await db.execute(`
            SELECT 
                * 
            FROM 
                user 
            WHERE 
                email = [email];`,
            { 
                email
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

module.exports = SignupService; // Export the SignupService class for external use