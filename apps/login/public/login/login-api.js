api.login = {
    process: async (usernameOrEmail, password) => {
        return await api.post(`${API_BASE_URL}/login`, { usernameOrEmail, password });
    }
};