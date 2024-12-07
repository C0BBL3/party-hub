/*
Creates an API Controller for the Main screen
Author Colby Roberts
*/
const UserService = require('../../services/user');

class MainAPIController {
    static async switchUserAccount(req, res) {
        const user = req.session.user;
        const userIdentifier = req.body.userIdentifier;

        if (user.isAdmin || user.isSupervisorMode) {
            let newUser;

            let prefix = userIdentifier.substr(0, 3);

            if (prefix === 'id=' || prefix == 'id:' && userIdentifier.length >= 4) {
                let userId = parseInt(userIdentifier.substr(3));

                newUser = await UserService.getUserById(userId);
            } else {
                newUser = await UserService.getUserByUsernameOrEmail(userIdentifier);
            }

            if (newUser) {
                newUser.isSupervisorMode = true;

                req.session.user = newUser;

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

                res.send({
                    result: true,
                    redirectUrl
                }); 
            } else {
                res.send({
                    error: "User account not found.",
                    result: false
                });
            }
        } else {
            res.send({
                error: "Sorry, you don't have permission to switch user accounts.",
                result: false
            });
        }
    }

    static unauthorizedAccess(req, res) {
        res.send({
            result: false,
            error: "Sorry, you don't have permission for this API call"
        });
    }
}

module.exports = MainAPIController;