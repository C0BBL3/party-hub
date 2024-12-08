/*
Creates an API Controller for the Privacy screen
Author Colby Roberts
*/

const PrivacyService = require("../../services/privacy");

class PrivacyAPIController {
    // Updates the privacy settings for the logged-in user
    static async update(req, res) {
        const userId = req.session.user.id;  // Get the logged-in user's ID

        const body = req.body;
        const privacy = body.privacy;  // Get the new privacy setting from the request body

        // Validate that the privacy setting is one of the acceptable values
        if (privacy != 'discoverable' && privacy != 'public' && privacy != 'private') {
            return res.send({
                result: false  // Invalid privacy value
            });
        }

        // Call PrivacyService to update the privacy setting in the database
        const result = await PrivacyService.updatePrivacy(userId, privacy);

        if (result) {
            res.send({
                result: true  // Privacy setting was successfully updated
            });
        } else {
            res.send({
                result: false  // Something went wrong while updating privacy
            });
        }
    }
}

module.exports = PrivacyAPIController;