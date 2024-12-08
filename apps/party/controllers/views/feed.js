/*
Creates a Controller for the Feed screen
Author Colby Roberts
*/
const FeedService = require('../../services/feed');  // Import FeedService for party and feed-related functionalities

class FeedController {
    // Renders the feed screen for the user
    static async render(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session

        // Render the 'feed' view and pass the 'user' object and 'section' identifier to the template
        res.render('feed/feed', {
            section: 'feed',  // This indicates the current section (could be used for highlighting or styles)
            user             // Pass the user data to the view
        });
    }
}

module.exports = FeedController;  // Export the FeedController class for use in other parts of the app