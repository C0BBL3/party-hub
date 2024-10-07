const db = require('../../../utils/database');

class SignupService {
    static generatePassword(length = 8) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
    }

    static async hashPassword(password = null) {
        const options = {
            logN: 11,
            r: 8,
            encoding: 'hex'
        };   

        return new Promise((resolve, reject) => {
            let salt = crypto.randomBytes(16).toString('hex');
                
            scryptAsync(password, salt, options, function(hash) {
                resolve({
                    salt: salt,
                    hash: hash
                });                
            });            
        });
    }  

    static async getUserById(id) {
        let result = await db.execute(`
            SELECT
                user.*,
            
            FROM
                user 

            WHERE
                user.id = [id];`, 
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
}

module.exports = SignupService;