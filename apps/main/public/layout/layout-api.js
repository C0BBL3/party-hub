api.main = {
    switchUser: async (userIdentifier) => {
        return await api.post(`${API_BASE_URL}/switch-user-account`, { userIdentifier });
    }
}