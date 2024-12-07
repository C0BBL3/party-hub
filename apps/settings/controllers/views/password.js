/*
Creates a Controller for the Password screen
Author Colby Roberts
*/
class PasswordController {
    static async render(req, res) {     
        const user = req.session.user;
      
        res.render('password/password', {
            section: 'password',
            user
        });
    }
}

module.exports = PasswordController;