/*
Sets up the API for the Friends screen
Author Makani Buckley, Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/party/friends`;

api.friends = {
    // Fetches the list of friends for a particular user
    friends: async (userId) => {
        // Sends a GET request to fetch friends for the given userId
        return await api.get(`${BASE_PATH}/${userId}`);
    },

    // Fetches the list of friend requests for a particular user
    requests: async (userId) => {
        // Sends a GET request to fetch pending friend requests for the userId
        return await api.get(`${BASE_PATH}/requests/${userId}`);
    },

    // Searches for friends based on a search query (username, name, etc.)
    search: async (search) => {
        // Sends a GET request to search for friends using the search term
        return await api.get(`${BASE_PATH}/search/${search}`);
    },

    // Removes a friend from the user's friend list
    removeFriend: async(userId, friendId) => {
        // Sends a POST request to remove a friend with the given friendId for the userId
        return await api.post(`${BASE_PATH}/remove`, { userId, friendId });
    },

    // Accepts a pending friend request
    accept: async (userId, friendId) => {
        // Sends a POST request to accept the friend request from friendId for the userId
        return await api.post(`${BASE_PATH}/accept`, { userId, friendId });
    },

    // Rejects a pending friend request
    reject: async (userId, friendId) => {
        // Sends a POST request to reject the friend request from friendId for the userId
        return await api.post(`${BASE_PATH}/reject`, { userId, friendId });
    },

    // Sends a friend request from the user to another user
    request: async (userId, friendId) => {
        // Sends a POST request to send a friend request from userId to friendId
        return await api.post(`${BASE_PATH}/request`, { userId, friendId });
    }
};