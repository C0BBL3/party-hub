/*
Creates a Controller for the Profile screen
Author Colby Roberts
*/
const ProfileService = require("../../services/profile");

class ProfileController {
    // Renders the profile screen
    static async render(req, res) {     
        const user = req.session.user;  // Get the logged-in user from the session
        
        // Fetch the profile picture in Base64 format from the ProfileService
        const pictureBase64 = await ProfileService.getPictureBase64(user.id);
      
        // Render the 'profile/profile' view with user data and profile picture
        res.render('profile/profile', {
            section: 'profile',     // Specifies the section for styling/navigation
            user,                   // Pass the user data to the view
            pictureBase64           // Pass the Base64 image string to display the profile picture
        });
    }
}

module.exports = ProfileController;