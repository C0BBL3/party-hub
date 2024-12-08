/*
Defines the services required by the User screen
Author Colby Roberts
*/

const crypto = require('crypto'); // Import the built-in crypto module
const scryptAsync = require('scrypt-async'); // Import the scrypt-async library for password hashing
const db = require('../../../utils/database'); // Import the database utility module

class UserService {
    // Generates a random alphanumeric password of the specified length.
    static generatePassword(length = 8) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Character set for password
        let result = '';

        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
    }

    
    // Hashes a password using the scrypt algorithm and generates a salt.
    static async hashPassword(password) {
        const options = {
            logN: 11, // Cost factor
            r: 8,     // Block size
            encoding: 'hex' // Output encoding
        };

        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt

            scryptAsync(password, salt, options, function(hash) {
                resolve({
                    salt: salt, // Generated salt
                    hash: hash  // Hashed password
                });
            });
        });
    }

    
    // Verifies a password by comparing it to the stored hash using the provided salt.
    static async verifyPassword(password, salt, savedHash) {
        const options = {
            logN: 11,
            r: 8,
            encoding: 'hex'
        };

        return new Promise((resolve, reject) => {
            scryptAsync(password, salt, options, function(hash) {
                resolve(hash === savedHash); // Compare the generated hash with the saved hash
            });
        });
    }

    // Generates a unique username based on the user's first name and ID.
    static generateUsername(user) {
        return (user.firstName + user.id).toLowerCase();
    }

    // Inserts a new user into the database, automatically generating a password and username if necessary.
    static async insertUser(user) {
        user.validated = true; // Mark the user as validated

        // Generate a password and hash it if one is not already provided
        if (!user.hash) {
            user.password = this.generatePassword();
            const { salt, hash } = await this.hashPassword(user.password);
            user.salt = salt;
            user.hash = hash;
        }

        // Avoid storing an empty string as email; set it to null instead
        if (user.email === '') {
            user.email = null;
        }

        // Insert the user into the database
        const result = await db.insert('user', user);

        if (result.error) {
            return null; // Return null if an error occurs during insertion
        }

        user.id = result.rows.insertId; // Retrieve the new user's ID

        // If the user is a student and does not have a username, generate one
        if (user.isStudent && !user.username) {
            user.username = this.generateUsername(user);

            // Update the user record with the generated username
            await db.update('user', {
                id: user.id,
                username: user.username
            });
        }

        return result.rows.insertId; // Return the ID of the newly inserted user
    }
}

module.exports = UserService; // Export the UserService class for external use