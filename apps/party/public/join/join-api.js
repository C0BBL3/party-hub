/*
Sets up the API endpoints for the Join screen
Author Colby Roberts
*/
api.join = {
    // Fetches the details of a party for a given partyId and patronId
    getParty: async (partyId, patronId) => {
        // Sends a GET request to fetch party details for the given partyId and patronId
        return await api.get(`${API_BASE_URL}/party/${partyId}/${patronId}`);
    },

    // Sends an RSVP request for a party for a specific patron
    RSVP: async (partyId, patronId) => {
        // Sends a POST request to RSVP for the party using the provided partyId and patronId
        return await api.post(`${API_BASE_URL}/party/rsvp`, { partyId, patronId });
    },
};