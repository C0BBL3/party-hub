const FeedService = require('../../services/feed');

class FeedController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('feed', {
            section: 'feed',
            user
        });
    }
}

module.exports = FeedController;