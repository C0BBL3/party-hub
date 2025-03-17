const { checkSchema } = require('express-validator');
const UserService = require('../services/user-service');
const PartyService = require('../services/party-service');

const APIParameter = require('./api-parameter');
const CustomerService = require('../services/customer-service');

class APIValidator {
    constructor() { }

    validateBody(req, res, next, schema) {
        let result = checkSchema(schema);
        result[result.length - 1](req, res, next);
    }

    validateId(parameterName, id) {
        const parameter = new APIParameter();
        if (!parameter.isInteger(id)) {
            return {
                valid: false,
                error: { code: 406, message: `'${id}' is an invalid value for parameter ${parameterName}.` }
            };
        }

        return {
            valid: true,
            error: null
        };
    }

    validateStr(parameterName, str) {
        const parameter = new APIParameter();
        if (!parameter.isStr(str)) {
            return {
                valid: false,
                error: { code: 406, message: `'${str}' is an invalid value for parameter ${parameterName}.` }
            };
        }

        return {
            valid: true,
            error: null
        };
    }

    validateDate(parameterName, str) {
        const parameter = new APIParameter();
        if (!parameter.isDate(str)) {
            return {
                valid: false,
                error: { code: 406, message: `'${str}' is an invalid value for parameter ${parameterName}.` }
            };
        }

        return {
            valid: true,
            error: null
        };
    }

    validateEmail(parameterName, email) {
        const parameter = new APIParameter();
        if (!parameter.isEmail(email)) {
            return {
                valid: false,
                error: { code: 406, message: `'${email}' is an invalid value for parameter ${parameterName}.` }
            };
        }

        return {
            valid: true,
            error: null
        };
    }

    validateDateRange(startDate, endDate) {
        const parameter = new APIParameter();
        if (!parameter.isTimeFrameOrdered(startDate, endDate)) {
            return {
                valid: false,
                error: { code: 406, message: `'${startDate}' to '${endDate}' is an invalid time frame.` }
            };
        }

        return {
            valid: true,
            error: null
        };
    }

    async validateUserId(id) {
        const validUserId = this.validateId('userId', id);

        if (!validUserId.valid) {
            return validUserId;
        }

        const user = await UserService.getUserById(id);

        if (user) {
            return {
                valid: true,
                error: null
            };
        }

        return {
            valid: false,
            error: { code: 404, message: "User not found." }
        };
    }

    async validateUserEmail(email) {
        const validUserEmail = this.validateEmail('email', email);

        if (!validUserEmail.valid) {
            return validUserEmail;
        }

        const user = await UserService.getUserByEmail(email);

        if (user) {
            return {
                valid: true,
                error: null
            };
        }

        return {
            valid: false,
            error: { code: 404, message: "User not found." }
        };
    }

    async validateUserUsername(username) {
        const validUserUsername = this.validateStr('username', username);

        if (!validUserUsername.valid) {
            return validUserUsername;
        }

        const user = await UserService.getUserByUsername(username);

        if (user) {
            return {
                valid: true,
                error: null
            };
        }

        return {
            valid: false,
            error: { code: 404, message: "User not found." }
        };
    }

    async validatePartyId(partyId) {
        const validPartyId = this.validateId('partyId', partyId);

        if (!validPartyId.valid) {
            return validPartyId;
        }

        const party = await PartyService.getPartyTitleById(partyId);

        if (party) {
            return {
                valid: true,
                error: null
            };
        }

        return {
            valid: false,
            error: { code: 404, message: "Party not found." }
        };
    }

    async validatePublicKey(publicKey) {
        const validPublicKey = this.validateStr('publicKey', publicKey);

        if (!validPublicKey.valid) {
            return validPublicKey;
        }

        const splitPublicKey = publicKey.split('_');
        const splitPublicKeyLengths = splitPublicKey.map(e => e.length);

        const parameter = new APIParameter();

        if (publicKey.length != 42 || splitPublicKey.length != 3 || !parameter.areArraysEqual(splitPublicKeyLengths, [2, 4, 34])) {
            return {
                valid: false,
                error: { code: 406, message: `Invalid public key.` }
            }
        }

        if (publicKey == 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') { // dummy key
            return {
                customerId: 'dummy',
                valid: true,
                error: null
            };
        }

        const customer = await CustomerService.validatePublicKey(publicKey);

        if (customer) {
            return {
                customerId: customer.id,
                valid: true,
                error: null
            };
        }

        return {
            valid: false,
            error: { code: 404, message: `Customer not found.` }
        };
    }
}

module.exports = APIValidator;