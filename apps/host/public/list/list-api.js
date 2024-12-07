/*
Sets up the API for the List screen
Author Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/host/list`;

api.list = {
    getUpcomingParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-upcoming-parties/${userId}`);
    },
    getPastParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-past-parties/${userId}`);
    },
    getPartyLink: async (userId, partyId) => {
        return await api.get(`${BASE_PATH}/get-party-link/${userId}/${partyId}`);

    }
}