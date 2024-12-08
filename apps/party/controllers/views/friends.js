/*
Creates a Controller for the Friends screen
Author Colby Roberts
*/
const FriendsService = require('../../services/friends');  // Import FriendsService to interact with the friends-related functionalities

class FriendsController {
    // Renders the friends screen for the user
    static async render(req, res) {
        const user = req.session.user;  // Get the logged-in user from the session

        // Retrieve the list of friends and friend requests for the logged-in user
        const friends = await FriendsService.getFriendsByUserId(user.id);  // Fetch the user's friends
        const requests = await FriendsService.getFriendRequestsByUserId(user.id);  // Fetch the user's friend requests

        // Render the 'friends' view and pass the required data (user, friends, and requests) to the template
        res.render('friends/friends', {
            section: 'friends',  // This indicates the current section (could be used for styling or navigation)
            user,                // Pass the user data to the view
            friends,             // Pass the list of friends to the view
            requests             // Pass the list of friend requests to the view
        });
    }
}

module.exports = FriendsController;  // Export the FriendsController class for use in other parts of the app