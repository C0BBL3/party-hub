const db = require('../../../utils/database');

class ProfileService {
    static async updatePicture(userId, pictureBase64) {
        const result = await db.update('user', {
            id: userId,
            pictureBase64
        });

        return result;
    }

    static async getPictureBase64(userId) {
        const result = await db.execute(`SELECT id, pictureBase64 FROM user WHERE id = [userId];`, { userId });

        if (result.rows.length === 1) {
            return result.rows[0].user.pictureBase64;
        }

        return null;
    }

    static async updateUsername(userId, username) {
        const result = await db.update('user', {
            id: userId,
            username
        });

        return result;
    }

    static async updateBiography(userId, biography) {
        const result = await db.update('user', {
            id: userId,
            biography
        });

        return result;
    }
}

module.exports = ProfileService;