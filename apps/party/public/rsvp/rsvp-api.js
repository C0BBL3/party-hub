api.rsvp = {
    getRSVPedParties: async (patronId) => {
        return await api.get(`${API_BASE_URL}/party/rsvp/get-RSVPed-parties/${patronId}`);
    },
    cancelRSVP: async (partyId, patronId) => {
        return await api.post(`${API_BASE_URL}/party/rsvp/cancel`, { partyId, patronId });
    }
}