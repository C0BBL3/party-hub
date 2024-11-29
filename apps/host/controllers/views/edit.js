const EditService = require('../../services/edit');

class EditController {
    static async render(req, res) {
        const user = req.session.user;

        if (!user || !user.id) {
            return res.redirect('/login');
        }

        const partyId = req.query.id;
        const isOwner = await EditService.checkIfUserIsHost(partyId, user.id);

        if (!isOwner) {
            return res.redirect('/host/create');
        }

        const party = await EditService.getPartyById(partyId);  

        res.render('edit/edit', {
            section: 'edit',
            user,
            party
        });
    }
}

module.exports = EditController;