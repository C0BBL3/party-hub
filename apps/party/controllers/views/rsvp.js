/*
Creates a Controller for the Friends screen
Author Colby Roberts
*/
const RSVPService = require('../../services/rsvp');

class RSVPController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('rsvp/rsvp', {
            section: 'rsvp',
            user
        });
    }
}

module.exports = RSVPController;