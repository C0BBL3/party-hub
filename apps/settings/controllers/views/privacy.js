
class PrivacyController {
    static async render(req, res) {     
        const user = req.session.user;
      
        res.render('privacy', {
            section: 'privacy',
            user
        });
    }
}

module.exports = PrivacyController;