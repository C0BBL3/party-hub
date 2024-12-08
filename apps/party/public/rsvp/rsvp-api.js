/*
Sets up the API for the RSVP screen
Author Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/party/rsvp`;

api.rsvp = {
    // Fetches the upcoming parties for a specific user by their userId
    getUpcomingParties: async (userId) => {
        // Sends a GET request to retrieve the list of upcoming parties for the given userId
        return await api.get(`${BASE_PATH}/get-upcoming-parties/${userId}`);
    },

    // Fetches the past parties for a specific user by their userId
    getPastParties: async (userId) => {
        // Sends a GET request to retrieve the list of past parties for the given userId
        return await api.get(`${BASE_PATH}/get-past-parties/${userId}`);
    },

    // Cancels the RSVP for a given party and patron
    cancelRSVP: async (partyId, patronId) => {
        // Sends a POST request to cancel the RSVP for the party with the provided partyId and patronId
        return await api.post(`${BASE_PATH}/cancel`, { partyId, patronId });
    }
};