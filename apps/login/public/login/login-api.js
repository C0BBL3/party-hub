/*
Sets up the API for the Login screen
Author Colby Roberts
*/
api.login = {
    // This method handles the API call for logging in
    process: async (usernameOrEmail, password) => {
        // Make a POST request to the login endpoint with the username/email and password
        return await api.post(`${API_BASE_URL}/login`, { usernameOrEmail, password });
    }
};
