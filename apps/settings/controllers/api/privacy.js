const APIController = require("../../lib/controllers/api-controller");
const PrivacyService = require("../../services/privacy");

class PrivacyAPIController extends APIController {
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