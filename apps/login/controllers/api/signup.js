/*
Creates an API Controller for the Signup screen
Author Colby Roberts
*/
const SignupService = require("../../services/signup");
const capitalizer = require("../../../../utils/capitilzer");

class SignupAPIController {
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
            isAdmin: 0,
            description: data.description,
            tags: data.tags
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

    static async createAdminAccount(req, res) {
        const admin = await SignupAPIController.parseAccountData(req.body);
        admin.isAdmin = 1;
        
        const userId = await SignupService.createAdminAccount(admin);   

        if (userId) {
            const user = await SignupService.getUserById(userId);
       
            req.session.user = user;

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
        const host = await SignupAPIController.parseAccountData(req.body);
        host.isHost = 1;

        const userId = await SignupService.createHostAccount(host);   

        if (userId) {
            const user = await SignupService.getUserById(userId);
            
            req.session.user = user;
            
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
        let patron = await SignupAPIController.parseAccountData(req.body);
        patron.isPatron = 1;
        
        const userId = await SignupService.createPatronAccount(patron);   

        if (userId) {
            const user = await SignupService.getUserById(userId);

            req.session.user = user;

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

    static async checkIfUniqueUsername(req, res) {
        const username = req.params.username;
        const user = await SignupService.getUserByUsername(username);

        res.send({
            result: !user
        });
    }

    static async checkIfUniqueEmail(req, res) {
        const email = req.params.email;
        const user = await SignupService.getUserByEmail(email);

        res.send({
            result: !user
        });
    }
}

module.exports = SignupAPIController;