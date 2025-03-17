const APIService = require("../../services/api");

class APIAPIController {
    static async linkUserToCustomer(req, res) {
        const userId = req.body.userId;

        if (!userId) {
            return res.send({ result: false });
        }

        const user = req.session.user;

        if (user.id != userId) {
            return res.send({ result: false });
        }

        try {
            await APIService.removeOldCustomer(userId);
        } catch {
            // do nothing
        }

        let clearance = user.isHost ? 'host' : 'patron';
        clearance = user.isAdmin ? 'admin' : clearance;

        const customer = await APIService.createCustomer(clearance);

        if (!customer) {
            return res.send({ result: false });
        }

        const result = await APIService.linkUserToCustomer(userId, customer.id);

        return res.send({ result, apiPublicKey: customer.apiPublicKey, apiSecretKey: customer.apiSecretKey });
    }
}

module.exports = APIAPIController;