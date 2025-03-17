const db = require('../../utils/database');

class AnomalyService {
    static async write(apiPublicKey, request, refused, reason, code) {
        const result = await db.insert('request', {
            apiPublicKey,
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
            refused,
            code,
            reason
        });

        return result.rows.insertId;
    }

    static async getLastRequest(apiPublicKey) {
        const result = await db.execute(`
            SELECT
                *
            
            FROM
                request
                
            WHERE
                apiPublicKey = [apiPublicKey]
                
            ORDER BY
                id DESC
            
            LIMIT 1;`,
            {
                apiPublicKey
            }
        );

        if (result.rows.length === 1) {
            return result.rows[0].requests;
        } else {
            return null;
        }
    }

    static async getStrikesOnKey(apiPublicKey) {
        const result = await db.execute(`
            SELECT
                count(id) as strikes
            
            FROM
                request
                
            WHERE
                apiPublicKey = [apiPublicKey] AND
                refused = 1 AND
                code <> '500';`,
            {
                apiPublicKey
            }
        );

        if (result.rows.length === 1) {
            return result.rows[0][''].strikes;
        } else {
            return null;
        }
    }
}

module.exports = AnomalyService;