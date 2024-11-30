const ProfileService = require("../../services/profile");

class ProfileAPIController {
    static async updateProfilePicture(req, res) {
        const user = req.session.user;

        const body = req.body;
        const userId = body.userId;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        const pictureBase64 = body.pictureBase64;

        const result = await ProfileService.updatePicture(userId, pictureBase64);

        res.send({ result });
    }

    static async updateName(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const firstName = body.firstName;
        const lastName = body.lastName;

        const result1 = await ProfileService.updateFirstName(userId, firstName);

        if (!result1) {
            return res.send({ result: false });
        }

        const result2 = await ProfileService.updateLastName(userId, lastName);

        if (result1 && result2) {
            req.session.user.firstName = firstName;
            req.session.user.lastName = lastName;
        }

        res.send({ result: result1 && result2 });
    }

    static async updateDescription(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const description = body.description;

        const result = await ProfileService.updateDescription(userId, description);

        if (result) {
            req.session.user.description = description;
        }

        res.send({ result });


    }

    static async updateTags(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const tags = body.tags;

        const result = await ProfileService.updateTags(userId, tags);

        if (result) {
            req.session.user.tags = tags;
        }

        res.send({ result });
    }
}

module.exports = ProfileAPIController;