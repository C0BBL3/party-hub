/*
Defines the services required by the Profile screen
Author Colby Roberts
*/

// Import the database utility for interacting with the database
const db = require('../../../utils/database');

class ProfileService {
    // Method to update the user's profile picture (in Base64 format)
    static async updatePicture(userId, pictureBase64) {
        // Update the user's profile picture in the database
        const result = await db.update('user', {
            id: userId,        // The user's ID
            pictureBase64      // The new profile picture in Base64 format
        });

        return !result.error; // Return true if the update is successful, false otherwise
    }

    // Method to get the user's profile picture in Base64 format
    static async getPictureBase64(userId) {
        // Execute a SQL query to get the user's profile picture
        const result = await db.execute(`SELECT id, pictureBase64 FROM user WHERE id = [userId];`, { userId });

        if (result.rows.length === 1) {
            // If a user is found, return the profile picture in Base64 format
            return result.rows[0].user.pictureBase64;
        }

        return null; // Return null if no user is found
    }

    // Method to update the user's first name
    static async updateFirstName(userId, firstName) {
        // Update the user's first name in the database
        const result = await db.update('user', {
            id: userId,    // The user's ID
            firstName      // The new first name
        });

        return !result.error; // Return true if the update is successful, false otherwise
    }
    
    // Method to update the user's last name
    static async updateLastName(userId, lastName) {
        // Update the user's last name in the database
        const result = await db.update('user', {
            id: userId,    // The user's ID
            lastName       // The new last name
        });

        return !result.error; // Return true if the update is successful, false otherwise
    }

    // Method to update the user's description
    static async updateDescription(userId, description) {
        // Update the user's description in the database
        const result = await db.update('user', {
            id: userId,      // The user's ID
            description      // The new description
        });

        return !result.error; // Return true if the update is successful, false otherwise
    }

    // Method to update the user's tags (e.g., vibes or interests)
    static async updateTags(userId, tags) {
        // Update the user's tags in the database
        const result = await db.update('user', {
            id: userId,    // The user's ID
            tags           // The new tags (e.g., user interests or vibes)
        });

        return !result.error; // Return true if the update is successful, false otherwise
    }
}

// Export the ProfileService class for use in other parts of the application
module.exports = ProfileService;