const db = require('../../../utils/database');

class APIService {
    static async removeOldCustomer(userId) {
        const result1 = await db.execute(`
            SELECT
                customer.id
            
            FROM
                user
                
                LEFT JOIN customer ON
                    user.customerId = customer.id
                    
            WHERE
                user.id = [userId];`,
            {
                userId
            }
        );

        if (result1.error || result1.rows.length === 0) { return }

        const customerId = result1.rows[0].customer.id;

        const result2 = await db.execute(`
            DELETE FROM
                customer
                
            WHERE
                id = [customerId];`,
            {
                customerId
            }
        );

        return !result2.error;
    }

    static async linkUserToCustomer(userId, customerId) {
        const result = await db.update('user', { id: userId, customerId });

        return !result.error;
    }

    static async createCustomer(clearance) {
        const API_KEY_LENGTH = 34;

        const apiPublicKey = 'pk_live_' + APIService._generateKey(API_KEY_LENGTH);
        const apiSecretKey = 'sk_live_' + APIService._generateKey(API_KEY_LENGTH);

        const result = await db.insert('customer', { clearance, apiPublicKey, apiSecretKey });

        return !result.error ? { id: result.rows.insertId, apiPublicKey, apiSecretKey } : null;
    }

    static _generateKey(length) {
        const chars = '0123456789AB.CDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
    
        for (let i = 0; i < length; i++) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
    
        return result;
    }
}

module.exports = APIService;