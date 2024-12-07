/*
Creates a Controller for the Feed screen
Author Colby Roberts
*/
const FeedService = require('../../services/feed');

class FeedController {
    static async render(req, res) {
        const user = req.session.user;

        res.render('feed/feed', {
            section: 'feed',
            user
        });
    }
}

module.exports = FeedController;