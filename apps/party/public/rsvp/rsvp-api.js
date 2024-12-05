const BASE_PATH = `${API_BASE_URL}/party/rsvp`;

api.rsvp = {
    getUpcomingParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-upcoming-parties/${userId}`);
    },
    getPastParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-past-parties/${userId}`);
    },
    cancelRSVP: async (partyId, patronId) => {
        return await api.post(`${BASE_PATH}/cancel`, { partyId, patronId });
    }
}