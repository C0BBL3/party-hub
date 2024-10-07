const SignupService = require("../../services/user");

class SignupAPIController {
    static async createAdminAccount(req, res) {
        const admin = await this.parseAccountData(req.body.data);
        admin.isAdmin = 1;
        
        const userId = await SignupService.createAdminAccount(admin);   

        if (userId) {
            this.loginUser(req, userId);

            res.send({
                result: true,
                userId
            });
        } else {
            res.send({
                result: false
            });
        }
    }

    static async createHostAccount(req, res) {
        const host = await this.parseAccountData(req.body.data);
        host.isHost = 1;

        const userId = await SignupService.createHostAccount(host);   

        if (userId) {
            this.loginUser(req, userId);
            
            res.send({
                result: true,
                userId
            });
        } else {
            res.send({
                result: false
            });
        }
    }

    static async createPatronAccount(req, res) {
        const patron = await this.parseAccountData(req.body.data);
        patron.isPatron = 1;
        
        const userId = await SignupService.createPatronAccount(patron);   

        if (userId) {
            this.loginUser(req, userId);

            res.send({
                result: true,
                userId
            });
        } else {
            res.send({
                result: false
            });
        }
    }

    static async parseAccountData(data) {
        const account = {
            firstName: capitalizer.fixCapitalization(data.firstName),
            lastName: capitalizer.fixCapitalization(data.lastName),
            username: data.username,
            password: '',
            salt: '',
            hash: '',
            isPatron: 0,
            isHost: 0,
            isAdmin: 0
        };

        if (data.password) {
            const { salt, hash } = await SignupService.hashPassword(data.password);

            account.salt = salt;
            account.hash = hash;
        } else {
            account.password = SignupService.generatePassword();
        }

        return account;
    }

    static async loginUser(req, userId) {
        const user = await SignupService.getUserById(userId);
        req.session.user = user;
        return user;
    }
}

module.exports = SignupAPIController;