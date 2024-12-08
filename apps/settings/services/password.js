/*
Defines the services required by the Password screen
Author Colby Roberts
*/

// Import necessary modules
const crypto = require('crypto'); // For generating random salts and hashing
const scryptAsync = require('scrypt-async'); // For performing password hashing asynchronously
const db = require('../../../utils/database'); // For interacting with the database

class PasswordService {
    // Method to generate a random password of a specified length
    static generatePassword(length = 8) {
        // The characters that can be used in the generated password
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        // Generate the password by randomly selecting characters
        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result; // Return the generated password
    }

    // Method to hash a given password using the scrypt algorithm
    static async hashPassword(password) {
        // Options for the scrypt hashing function
        const options = {
            logN: 11, // Work factor (2^11 iterations)
            r: 8, // Block size
            encoding: 'hex' // Output encoding (hexadecimal)
        };

        return new Promise((resolve, reject) => {
            // Generate a random salt (16 bytes)
            let salt = crypto.randomBytes(16).toString('hex');

            // Use scrypt-async to hash the password with the salt
            scryptAsync(password, salt, options, function(hash) {
                resolve({
                    salt: salt, // Return the salt used
                    hash: hash  // Return the resulting hash
                });
            });
        });
    }

    // Method to verify if the provided password matches the saved hash
    static async verifyPassword(password, salt, savedHash) {
        // Options for the scrypt hashing function
        const options = {
            logN: 11, // Work factor (2^11 iterations)
            r: 8, // Block size
            encoding: 'hex' // Output encoding (hexadecimal)
        };

        return new Promise((resolve, reject) => {
            // Use scrypt-async to hash the password with the given salt
            scryptAsync(password, salt, options, function(hash) {
                // Check if the resulting hash matches the saved hash
                let verified = (hash === savedHash);

                resolve(verified); // Return the result of the comparison (true or false)
            });
        });
    }

    // Method to update the user's password in the database
    static async updatePassword(userId, password) {
        // Hash the new password and get the salt and hash
        const { salt, hash } = await this.hashPassword(password);

        // Update the user's password in the database with the new salt and hash
        const result = await db.update('user', {
            id: userId,
            password: '', // Password field is cleared (not used anymore)
            salt, // Save the salt
            hash // Save the hashed password
        });

        return !result.error; // Return true if the update was successful, false if there was an error
    }
}

// Export the PasswordService class for use in other parts of the application
module.exports = PasswordService;