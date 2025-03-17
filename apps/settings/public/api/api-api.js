const BASE_PATH = `${API_BASE_URL}/settings/api`;

api.customer = {
    create: async (userId) => {
        return await api.post(`${BASE_PATH}/create`, { userId });
    }
}