const RSVPService = require('../../services/rsvp');

class RSVPController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('rsvp', {
            section: 'rsvp',
            user
        });
    }
}

module.exports = RSVPController;