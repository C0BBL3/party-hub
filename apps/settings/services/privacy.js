/*
Defines the services required by the Privacy screen
Author Colby Roberts
*/
const db = require('../../../utils/database');

class PrivacyService {
    static async updatePrivacy(userId, privacy) {
        const result = await db.update('user', {
            id: userId,
            privacy
        });

        return result;
    }
}

module.exports = PrivacyService;