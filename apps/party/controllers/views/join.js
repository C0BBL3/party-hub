/*
Creates a Controller for the Join screen
Author Colby Roberts
*/
const ListService = require('../../../host/services/list');
const JoinService = require('../../services/join');

class JoinController {
    static async render(req, res) {
        const secretKey = req.params.secretKey;
        
        if (!req.session.user) { // if user isn't logged in, redirect them to log in w/ a callback to this route when done
            return res.redirect(`/login?redirect=party/${secretKey}`);
        }
        
        const user = req.session.user;  

        const party = await JoinService.getPartyBySecretKey(secretKey);

        if (!party) {
            return res.render('join/join', {
                user,
                partyId: null,
            });
        }

        const rsvpCount = await ListService.getRSVPCountByPartyId(party.id);

        if (rsvpCount >= 100) { // party can only have 100 patrons
            return res.render('join/join', {
                user,
                partyId: null,
            });
        }

        res.render('join/join', {
            user,
            partyId: party ? party.id : null,
        });
    }
}

module.exports = JoinController;