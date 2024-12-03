const ListService = require('../../services/list');

class ListAPIController {
    static async getUpcomingParties(req, res) {
        const user = req.session.user;
        const hostId = parseInt(req.params.hostId);

        if (user.id != hostId) {
            return res.send({ result: false });
        }

        const upcoming = await ListService.getUpcomingParties(user.id);

        res.send({
            result: true,
            upcoming
        });
    }

    static async getPastParties(req, res) {
        const user = req.session.user;
        const hostId = parseInt(req.params.hostId);

        if (user.id != hostId) {
            return res.send({ result: false });
        }

        const past = await ListService.getPastParties(user.id);

        res.send({
            result: true,
            past
        });
    }
}

module.exports = ListAPIController;