const db = require('../../../utils/database');

const crypto = require('crypto');
const scryptAsync = require('scrypt-async');

class LoginService {
    static async getUserByUsernameOrEmail(usernameOrEmail) {
        const result = await db.execute(`
            SELECT 
                *
            FROM 
                user                  
            WHERE                
                username = [usernameOrEmail] OR
                email = [usernameOrEmail];`,
            {
                usernameOrEmail
            }
        );

        if (result.rows.length === 1) {
            const row = result.rows[0];
            const user = row.user;

            return user;
        }

        return null;
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

    static async verifyPassword(password, salt, savedHash) {
        const options = {
            logN: 11,
            r: 8,
            encoding: 'hex'
        };   

        return new Promise((resolve, reject) => {
            scryptAsync(password, salt, options, function(hash) {
                let verified = (hash === savedHash);

                resolve(verified);                
            });   
        });            
    }
}

module.exports = LoginService;