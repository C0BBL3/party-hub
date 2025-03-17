class APIController {
    static async render(req, res) {     
        const user = req.session.user;
      
        res.render('api/api', {
            section: 'api',  
            user
        });
    }
}

module.exports = APIController;