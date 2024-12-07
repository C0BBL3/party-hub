/*
Creates a Controller for the Profile screen
Author Colby Roberts
*/
const ProfileService = require("../../services/profile");

class ProfileController {
    static async render(req, res) {     
        const user = req.session.user;
        const pictureBase64 = await ProfileService.getPictureBase64(user.id);
      
        res.render('profile/profile', {
            section: 'profile',
            user,
            pictureBase64
        });
    }
}

module.exports = ProfileController;