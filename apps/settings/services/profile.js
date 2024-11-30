const db = require('../../../utils/database');

class ProfileService {
    static async updatePicture(userId, pictureBase64) {
        const result = await db.update('user', {
            id: userId,
            pictureBase64
        });

        return !result.error;
    }

    static async getPictureBase64(userId) {
        const result = await db.execute(`SELECT id, pictureBase64 FROM user WHERE id = [userId];`, { userId });

        if (result.rows.length === 1) {
            return result.rows[0].user.pictureBase64;
        }

        return null;
    }

    static async updateFirstName(userId, firstName) {
        const result = await db.update('user', {
            id: userId,
            firstName
        });

        return !result.error;
    }
    
    static async updateLastName(userId, lastName) {
        const result = await db.update('user', {
            id: userId,
            lastName
        });

        return !result.error;
    }

    static async updateDescription(userId, description) {
        const result = await db.update('user', {
            id: userId,
            description
        });

        return !result.error;
    }

    static async updateTags(userId, tags) {
        const result = await db.update('user', {
            id: userId,
            tags
        });

        return !result.error;
    }
}

module.exports = ProfileService;