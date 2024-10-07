class PasswordController {
    static async render(req, res) {     
        const user = req.session.user;
      
        res.render('password', {
            section: 'password',
            user
        });
    }
}

module.exports = PasswordController;