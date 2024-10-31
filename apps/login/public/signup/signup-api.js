api.signup = {
    checkIfUniqueUsername: async (username) => {
        return await api.get(`${API_BASE_URL}/signup/check-if-unique-username/${username}`);
    },
    checkIfUniqueEmail: async (email) => {
        return await api.get(`${API_BASE_URL}/signup/check-if-unique-email/${email}`);
    },
    process: async (data) => {
        return await api.post(`${API_BASE_URL}/signup/patron`, data);
    }
};