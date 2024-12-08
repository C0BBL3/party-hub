/*
Sets up the API for the Signup screen
Author Colby Roberts
*/
api.signup = {
    // Function to check if the provided username is unique
    checkIfUniqueUsername: async (username) => {
        // Sends a GET request to the backend to check if the username already exists
        return await api.get(`${API_BASE_URL}/signup/check-if-unique-username/${username}`);
    },

    // Function to check if the provided email is unique
    checkIfUniqueEmail: async (email) => {
        // Sends a GET request to the backend to check if the email already exists
        return await api.get(`${API_BASE_URL}/signup/check-if-unique-email/${email}`);
    },

    // Function to process the signup form data
    process: async (data) => {
        // Determines the user type based on the provided data: 'host' if isHost is true and isPatron is false, otherwise 'patron'
        const type = (data.isHost && !data.isPatron) ? 'host' : 'patron';
        // Sends a POST request to the backend to create the user account based on the type ('host' or 'patron')
        return await api.post(`${API_BASE_URL}/signup/${type}`, data);
    }
};
