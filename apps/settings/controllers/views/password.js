/*
Creates a Controller for the Password screen
Author Colby Roberts
*/

class PasswordController {
    // Renders the password screen
    static async render(req, res) {     
        const user = req.session.user;  // Get the logged-in user from the session
      
        // Render the 'password/password' view with the user's data and section info
        res.render('password/password', {
            section: 'password',  // Specifies the section for the page (used for styling or navigation)
            user                  // Pass the user data to the view for personalized content
        });
    }
}

module.exports = PasswordController;