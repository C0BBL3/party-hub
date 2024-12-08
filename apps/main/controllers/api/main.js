/*
Creates an API Controller for the Main screen
Author Colby Roberts
*/
const UserService = require('../../services/user');

class MainAPIController {
    static async switchUserAccount(req, res) {
        const user = req.session.user; // Get the current user from the session
        const userIdentifier = req.body.userIdentifier; // Extract the user identifier from the request body

        // Check if the user has admin or supervisor permissions
        if (user.isAdmin || user.isSupervisorMode) {
            let newUser;
            const prefix = userIdentifier.substr(0, 3); // Extract the prefix from the identifier

            // Determine if the identifier is a user ID
            if ((prefix === 'id=' || prefix === 'id:') && userIdentifier.length >= 4) {
                const userId = parseInt(userIdentifier.substr(3)); // Extract the numeric ID
                newUser = await UserService.getUserById(userId); // Fetch the user by ID
            } else {
                // Otherwise, treat it as a username or email
                newUser = await UserService.getUserByUsernameOrEmail(userIdentifier);
            }

            if (newUser) {
                // Enable supervisor mode for the new user
                newUser.isSupervisorMode = true;

                // Update the session with the new user details
                req.session.user = newUser;

                // Determine the appropriate redirect URL based on the new user's roles
                let redirectUrl;
                if (newUser.isAdmin) {
                    redirectUrl = '/admin';
                } else if (newUser.isHost) {
                    redirectUrl = '/host';
                } else if (newUser.isPatron) {
                    redirectUrl = '/party';
                } else {
                    redirectUrl = '/';
                }

                // Send a successful response with the redirect URL
                res.send({
                    result: true,
                    redirectUrl
                });
            } else {
                // Respond with an error if the specified user account cannot be found
                res.send({
                    error: "User account not found.",
                    result: false
                });
            }
        } else {
            // Respond with an error if the current user lacks permissions to switch accounts
            res.send({
                error: "Sorry, you don't have permission to switch user accounts.",
                result: false
            });
        }
    }

    static unauthorizedAccess(req, res) {
        // Respond with a generic unauthorized access error
        res.send({
            result: false,
            error: "Sorry, you don't have permission for this API call"
        });
    }
}

module.exports = MainAPIController; // Export the controller for use in routing and other modules