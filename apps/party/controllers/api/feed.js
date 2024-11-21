const FeedService = require('../../services/feed');

class FeedAPIController {
    static async getFirst10Parties(req, res) {
        const parties = await FeedService.getFirst10Parties();
        
        res.send({
            result: true,
            parties
        });
    }
}

module.exports = FeedAPIController;