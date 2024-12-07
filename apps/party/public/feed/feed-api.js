/*
Sets up the API endpoints for the Feed screen
Author Colby Roberts
*/
api.feed = {
    getFirst10Parties: async () => {
        return await api.get(`${API_BASE_URL}/party/feed/get-first-10-parties`);
    },
    getFeaturedParties: async () => {
        return await api.get(`${API_BASE_URL}/party/feed/get-featured-parties`);
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
    followHost: async (userId, hostId) => {
        return await api.post(`${API_BASE_URL}/party/feed/follow-host`, { userId, hostId });
    },
    unfollowHost: async (userId, hostId) => {
        return await api.post(`${API_BASE_URL}/party/feed/unfollow-host`, { userId, hostId });
    }
}