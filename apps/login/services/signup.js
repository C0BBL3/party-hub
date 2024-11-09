const db = require('../../../utils/database');

const crypto = require('crypto');
const scryptAsync = require('scrypt-async');

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

    static async createHostAccount(host) {
        host.isHost = 1;
        let result = await db.insert('user', host);

        return result.rows.insertId;
    }

    static async createPatronAccount(patron) {
        patron.isPatron = 1;
        let result = await db.insert('user', patron);

        return result.rows.insertId;
    }

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

module.exports = SignupService;