/*
Sets up the API for the Friends screen
Author Makani Buckley, Colby Roberts
*/
api.friends = {
    refresh: async (userId) => {
        return await api.get(`${API_BASE_URL}/party/friends/${userId}`);
    },
    requests: async (userId) => {
        return await api.get(`${API_BASE_URL}/party/friends/requests/${userId}`);
    },
    search: async (search) => {
        return await api.get(`${API_BASE_URL}/party/friends/search/${search}`);
    },
    accept: async (userId, friendId) => {
        return await api.post(`${API_BASE_URL}/party/friends/accept`, { userId, friendId });
    },
    reject: async (userId, friendId) => {
        return await api.post(`${API_BASE_URL}/party/friends/reject`, { userId, friendId });
    },
    request: async (userId, friendId) => {
        return await api.post(`${API_BASE_URL}/party/friends/request`, { userId, friendId});
    }
};