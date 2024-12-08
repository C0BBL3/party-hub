/*
Creates an API Controller for the Profile screen
Author Colby Roberts
*/

const ProfileService = require("../../services/profile");

class ProfileAPIController {

    // Updates the profile picture for the logged-in user
    static async updateProfilePicture(req, res) {
        const user = req.session.user;  // Get the logged-in user

        const body = req.body;
        const userId = body.userId;  // Get the userId from the request body

        // Ensure the logged-in user matches the userId in the request
        if (user.id != userId) {
            return res.send({ result: false });
        }

        const pictureBase64 = body.pictureBase64;  // Get the base64 encoded image data

        // Call the ProfileService to update the user's profile picture
        const result = await ProfileService.updatePicture(userId, pictureBase64);

        res.send({ result });
    }

    // Updates the user's first and last name
    static async updateName(req, res) {
        const userId = req.session.user.id;  // Get the logged-in user's ID

        const body = req.body;
        const firstName = body.firstName;  // Get the first name from the request body
        const lastName = body.lastName;    // Get the last name from the request body

        // Update first name using ProfileService
        const result1 = await ProfileService.updateFirstName(userId, firstName);

        if (!result1) {
            return res.send({ result: false });
        }

        // Update last name using ProfileService
        const result2 = await ProfileService.updateLastName(userId, lastName);

        // If both updates are successful, update the session with the new names
        if (result1 && result2) {
            req.session.user.firstName = firstName;
            req.session.user.lastName = lastName;
        }

        // Respond with the result of both updates
        res.send({ result: result1 && result2 });
    }

    // Updates the user's description
    static async updateDescription(req, res) {
        const userId = req.session.user.id;  // Get the logged-in user's ID

        const body = req.body;
        const description = body.description;  // Get the description from the request body

        // Call ProfileService to update the user's description
        const result = await ProfileService.updateDescription(userId, description);

        // If the update is successful, update the session with the new description
        if (result) {
            req.session.user.description = description;
        }

        res.send({ result });
    }

    // Updates the user's tags
    static async updateTags(req, res) {
        const userId = req.session.user.id;  // Get the logged-in user's ID

        const body = req.body;
        const tags = body.tags;  // Get the tags from the request body

        // Call ProfileService to update the user's tags
        const result = await ProfileService.updateTags(userId, tags);

        // If the update is successful, update the session with the new tags
        if (result) {
            req.session.user.tags = tags;
        }

        res.send({ result });
    }
}

module.exports = ProfileAPIController;