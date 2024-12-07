/*
Creates an API Controller for the Privacy screen
Author Colby Roberts
*/
const PrivacyService = require("../../services/privacy");

class PrivacyAPIController {
    static async update(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const privacy = body.privacy;

        if (privacy != 'discoverable' && privacy != 'public' && privacy != 'private') {
            return res.send({
                result: false
            });
        }

        const result = await PrivacyService.updatePrivacy(userId, privacy);

        if (result) {  
            res.send({
                result: true
            });
        } else {
            res.send({
                result: false
            });
        }
    }
}

module.exports = PrivacyAPIController;