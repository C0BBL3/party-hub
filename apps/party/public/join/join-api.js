/*
Sets up the API endpoints for the Join screen
Author Colby Roberts
*/
api.join = {
    getParty: async (partyId, patronId) => {
        return await api.get(`${API_BASE_URL}/party/${partyId}/${patronId}`)
    },
    RSVP: async (partyId, patronId) => {
        return await api.post(`${API_BASE_URL}/party/rsvp`, { partyId, patronId });
    },
}