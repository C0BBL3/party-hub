api.feed = {
    getFirst10Parties: async () => {
        return await api.get(`${API_BASE_URL}/party/feed/get-first-10-parties`);
    },
    checkStatus: async (partyId, patronId) => {
        return await api.get(`${API_BASE_URL}/party/rsvp/${partyId}/check/${patronId}`);
    },
    RSVP: async (partyId, patronId) => {
        return await api.post(`${API_BASE_URL}/party/rsvp`, { partyId, patronId });
    },
    cancelRSVP: async (partyId, patronId) => {
        return await api.post(`${API_BASE_URL}/party/rsvp/cancel`, { partyId, patronId });
    },
}