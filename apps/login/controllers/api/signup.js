/*
Creates an API Controller for the Signup screen
Author Colby Roberts
*/
const SignupService = require("../../services/signup");  // Importing the SignupService to handle account creation and validation
const capitalizer = require("../../../../utils/capitilzer");  // Importing the capitalizer utility to properly format names

class SignupAPIController {
    // Parses account data from the request and creates an account object
    static async parseAccountData(data) {
        const account = {
            firstName: capitalizer.fixCapitalization(data.firstName),  // Ensures first name is properly capitalized
            lastName: capitalizer.fixCapitalization(data.lastName),  // Ensures last name is properly capitalized
            username: data.username,  // User's chosen username
            password: '',  // Placeholder for password (will be hashed later)
            salt: '',  // Placeholder for password salt
            hash: '',  // Placeholder for hashed password
            isPatron: 0,  // Default role is not a patron
            isHost: 0,  // Default role is not a host
            isAdmin: 0,  // Default role is not an admin
            description: data.description,  // User's description
            tags: data.tags  // User's tags
        };

        // If password is provided, hash it; otherwise, generate a temporary password
        if (data.password) {
            const { salt, hash } = await SignupService.hashPassword(data.password);  // Hash the password
            account.salt = salt;  // Save the salt
            account.hash = hash;  // Save the hashed password
        } else {
            account.password = SignupService.generatePassword();  // Generate a temporary password if none is provided
        }

        return account;  // Return the prepared account object
    }

    // Creates an admin account using the provided signup data
    static async createAdminAccount(req, res) {
        const admin = await SignupAPIController.parseAccountData(req.body);  // Parse the account data
        admin.isAdmin = 1;  // Set the user role to admin
        
        const userId = await SignupService.createAdminAccount(admin);  // Create the admin account in the database

        // If the account was created successfully
        if (userId) {
            const user = await SignupService.getUserById(userId);  // Fetch the newly created admin user
            req.session.user = user;  // Store the user in the session

            res.send({
                result: true,  // Indicate success
                userId  // Return the user ID
            });
        } else {
            res.send({
                result: false  // Indicate failure if account creation fails
            });
        }
    }

    // Creates a host account using the provided signup data
    static async createHostAccount(req, res) {
        const host = await SignupAPIController.parseAccountData(req.body);  // Parse the account data
        host.isHost = 1;  // Set the user role to host

        const userId = await SignupService.createHostAccount(host);  // Create the host account in the database

        // If the account was created successfully
        if (userId) {
            const user = await SignupService.getUserById(userId);  // Fetch the newly created host user
            req.session.user = user;  // Store the user in the session

            res.send({
                result: true,  // Indicate success
                userId  // Return the user ID
            });
        } else {
            res.send({
                result: false  // Indicate failure if account creation fails
            });
        }
    }

    // Creates a patron account using the provided signup data
    static async createPatronAccount(req, res) {
        let patron = await SignupAPIController.parseAccountData(req.body);  // Parse the account data
        patron.isPatron = 1;  // Set the user role to patron
        
        const userId = await SignupService.createPatronAccount(patron);  // Create the patron account in the database

        // If the account was created successfully
        if (userId) {
            const user = await SignupService.getUserById(userId);  // Fetch the newly created patron user
            req.session.user = user;  // Store the user in the session

            res.send({
                result: true,  // Indicate success
                userId  // Return the user ID
            });
        } else {
            res.send({
                result: false  // Indicate failure if account creation fails
            });
        }
    }

    // Checks if the username is unique by querying the database
    static async checkIfUniqueUsername(req, res) {
        const username = req.params.username;  // Get the username from the request parameters
        const user = await SignupService.getUserByUsername(username);  // Check if the username already exists

        res.send({
            result: !user  // If the user does not exist, return true; otherwise, false
        });
    }

    // Checks if the email is unique by querying the database
    static async checkIfUniqueEmail(req, res) {
        const email = req.params.email;  // Get the email from the request parameters
        const user = await SignupService.getUserByEmail(email);  // Check if the email already exists

        res.send({
            result: !user  // If the email does not exist, return true; otherwise, false
        });
    }
}

module.exports = SignupAPIController;  // Export the SignupAPIController to be used in other parts of the application