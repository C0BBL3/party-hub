const BASE_PATH = `${API_BASE_URL}/host/list`;

api.list = {
    getUpcomingParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-upcoming-parties/${userId}`);
    },
    getPastParties: async (userId) => {
        return await api.get(`${BASE_PATH}/get-past-parties/${userId}`);
    },
}