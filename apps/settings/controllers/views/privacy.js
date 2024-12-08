/*
Creates a Controller for the Privacy screen
Author Colby Roberts
*/

class PrivacyController {
    // Renders the privacy screen
    static async render(req, res) {     
        const user = req.session.user;  // Get the logged-in user from the session
      
        // Render the 'privacy/privacy' view with the user's data and section info
        res.render('privacy/privacy', {
            section: 'privacy',  // Specifies the section for the page (used for styling or navigation)
            user                  // Pass the user data to the view for personalized content
        });
    }
}

module.exports = PrivacyController;