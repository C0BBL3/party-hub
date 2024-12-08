/*
Sets up the API endpoints for the Profile screen
Author Colby Roberts
*/

// Define the base URL path for all profile-related API requests
const BASE_PATH = `${API_BASE_URL}/settings/profile`;

// Set up the API functions for profile updates
api.profile = {
    // Function to update the profile picture
    updateProfilePicture: async (userId, pictureBase64) => {
        // Sends a POST request to the update-profile-picture endpoint with userId and the Base64 encoded picture
        return await api.post(`${BASE_PATH}/update-profile-picture`, { userId, pictureBase64 });
    },

    // Function to update the user's name (first and last)
    updateName: async (userId, firstName, lastName) => {
        // Sends a POST request to the update-name endpoint with userId, first name, and last name
        return await api.post(`${BASE_PATH}/update-name`, { userId, firstName, lastName });
    },

    // Function to update the user's description
    updateDescription: async (userId, description) => {
        // Sends a POST request to the update-description endpoint with userId and the new description
        return await api.post(`${BASE_PATH}/update-description`, { userId, description });
    },

    // Function to update the user's vibes (tags)
    updateVibes: async (userId, vibes) => {
        // Sends a POST request to the update-tags endpoint with userId and the new vibes (tags)
        return await api.post(`${BASE_PATH}/update-tags`, { userId, tags: vibes });
    }
}