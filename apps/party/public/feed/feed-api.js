api.feed = {
    getFirst10Parties: async () => {
        return await api.get(`${API_BASE_URL}/party/feed/get-first-10-parties`);
    },
    rsvp: async (partyId, userId) => {
        return await api.post(`${API_BASE_URL}/party/rsvp`, { partyId, userId });
    }
}