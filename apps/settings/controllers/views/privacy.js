/*
Creates a Controller for the Privacy screen
Author Colby Roberts
*/
class PrivacyController {
    static async render(req, res) {     
        const user = req.session.user;
      
        res.render('privacy/privacy', {
            section: 'privacy',
            user
        });
    }
}

module.exports = PrivacyController;