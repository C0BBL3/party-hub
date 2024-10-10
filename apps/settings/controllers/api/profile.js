const ProfileService = require("../../services/profile");

class ProfileAPIController {
    static async updatePicture(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const pictureBase64 = body.pictureBase64;

        let result = await ProfileService.updatePicture(userId, pictureBase64);

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

    static async updateUsername(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const username = body.username;

        const result = await ProfileService.updateUsername(userId, username);

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

    static async updateBiography(req, res) {
        const userId = req.session.user.id;

        const body = req.body;
        const biography = body.biography;

        const result = await ProfileService.updateBiography(userId, biography);

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

module.exports = ProfileAPIController;