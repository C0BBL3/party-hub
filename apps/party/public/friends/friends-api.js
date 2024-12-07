/*
Sets up the API for the Friends screen
Author Makani Buckley, Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/party/friends`;

api.friends = {
    friends: async (userId) => {
        return await api.get(`${BASE_PATH}/${userId}`);
    },
    requests: async (userId) => {
        return await api.get(`${BASE_PATH}/requests/${userId}`);
    },
    search: async (search) => {
        return await api.get(`${BASE_PATH}/search/${search}`);
    },
    removeFriend: async(userId, friendId) => {
        return await api.post(`${BASE_PATH}/remove`, { userId, friendId })
    },
    accept: async (userId, friendId) => {
        return await api.post(`${BASE_PATH}/accept`, { userId, friendId });
    },
    reject: async (userId, friendId) => {
        return await api.post(`${BASE_PATH}/reject`, { userId, friendId });
    },
    request: async (userId, friendId) => {
        return await api.post(`${BASE_PATH}/request`, { userId, friendId});
    }
};