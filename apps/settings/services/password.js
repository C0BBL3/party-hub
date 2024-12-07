/*
Defines the services required by the Password screen
Author Colby Roberts
*/
const crypto = require('crypto');
const scryptAsync = require('scrypt-async');
const db = require('../../../utils/database');

class PasswordService {
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

    static async updatePassword(userId, password) {
        const { salt, hash } = await this.hashPassword(password);

        const result = await db.update('user', {
            id: userId,
            password: '',
            salt,
            hash
        });

        return !result.error;
    }
}

module.exports = PasswordService;