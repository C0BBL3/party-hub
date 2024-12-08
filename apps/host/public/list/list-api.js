/*
Sets up the API for the List screen
Author: Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/host/list`; // Define the base URL for the List API endpoint

api.list = {
    // Function to get a list of upcoming parties for a specific user
    getUpcomingParties: async (userId) => {
        // Sends a GET request to fetch upcoming parties for the provided userId
        return await api.get(`${BASE_PATH}/get-upcoming-parties/${userId}`);
    },

    // Function to get a list of past parties for a specific user
    getPastParties: async (userId) => {
        // Sends a GET request to fetch past parties for the provided userId
        return await api.get(`${BASE_PATH}/get-past-parties/${userId}`);
    },

    // Function to get the secret party link for a specific party
    getPartyLink: async (userId, partyId) => {
        // Sends a GET request to retrieve the secret link for the given partyId
        return await api.get(`${BASE_PATH}/get-party-link/${userId}/${partyId}`);
    }
}
