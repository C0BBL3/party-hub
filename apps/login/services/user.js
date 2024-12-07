/*
Defines the services required by the User screen
Author Colby Roberts
*/
const crypto = require('crypto');
const scryptAsync = require('scrypt-async');
const db = require('../../../utils/database');

class UserService {
    static generatePassword(length = 8) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        for (let i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
    }

    static async hashPassword(password) {
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

    static generateUsername(user) {
        return (user.firstName + user.id).toLowerCase();
    }
    
    static async insertUser(user) {
        user.validated = true;

        if (!user.hash) {
            user.password = this.generatePassword();

            const { salt, hash } = await this.hashPassword(user.password);

            user.salt = salt;
            user.hash = hash;            
        }

        // The unique key constraint on the email column will throw an error if we try to save an empty string so just set it to null
        if (user.email === '') {
            user.email = null;
        }

        const result = await db.insert('user', user);

        if (result.error) {
            return null;
        }

        user.id = result.rows.insertId;

        if (user.isStudent && !user.username) {
            user.username = this.generateUsername(user);

            await db.update('user', {
                id: user.id,
                username: user.username
            });            
        }    
                
        return result.rows.insertId;
    }

    

}

module.exports = UserService;