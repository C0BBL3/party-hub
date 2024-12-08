/*
Sets up the API for the Create screen
Author: Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/host/create`; // Define the base URL for the Create API endpoint

api.create = {
    // Function to check if a party title is unique
    checkIfUniquePartyTitle: async (partyTitle) => {
        // Sends a GET request to check if the provided party title already exists
        return await api.get(`${BASE_PATH}/check-if-unique-party-title/${partyTitle}`);
    },

    // Function to request creating a new party
    requestCreateParty: async (title, address, privacy, start, vibes, description, pictureBase64) => {
        // Sends a POST request with all necessary data to create a new party
        return await api.post(`${BASE_PATH}/request-create-party`, {
            title,         // Title of the party
            address,       // Address object containing street, postal code, city, and state
            privacy,       // Privacy setting for the party (e.g., Discoverable)
            start,         // Start date and time of the party
            vibes,         // Vibe of the party (e.g., casual, formal)
            description,   // Description of the party
            pictureBase64  // Base64 encoded image for the party's picture
        });
    }
}
