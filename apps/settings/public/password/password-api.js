/*
Sets up the API endpoints for the Password screen
Author Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/settings/password`;  // Base path for password-related API endpoints

api.password = {
    // Function to verify the user's password
    verify: async (userId, password) => {
        return await api.get(`${BASE_PATH}/verify/${userId}?password=${password}`);
    },

    // Function to update the user's password
    update: async (userId, password) => {
        return await api.post(`${BASE_PATH}/update`, { userId, password });
    }
}