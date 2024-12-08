/*
Sets up the API for the Edit screen
Author: Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/host/edit`; // Define the base URL for the Edit API endpoint

api.edit = {
    // Function to request editing a party's details
    requestEditParty: async (partyId, userId, privacy, startTime, vibes, description, pictureBase64) => {
        // Sends a POST request with the necessary details to edit a party
        return await api.post(`${BASE_PATH}/request-edit-party`, {
            partyId,        // ID of the party to edit
            userId,         // ID of the user making the request
            privacy,        // Privacy setting for the party (e.g., Discoverable)
            startTime,      // New start time for the party
            vibes,          // New vibe for the party (e.g., casual, formal)
            description,    // New description of the party
            pictureBase64   // Base64 encoded image for the updated party's picture
        });
    }
}
