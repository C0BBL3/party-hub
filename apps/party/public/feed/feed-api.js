/*
Sets up the API endpoints for the Feed screen
Author Colby Roberts
*/
api.feed = {
    // Fetches the first 10 parties from the feed
    getFirst10Parties: async () => {
        // Sends a GET request to fetch the first 10 parties
        return await api.get(`${API_BASE_URL}/party/feed/get-first-10-parties`);
    },

    // Fetches a list of featured parties from the feed
    getFeaturedParties: async () => {
        // Sends a GET request to fetch featured parties
        return await api.get(`${API_BASE_URL}/party/feed/get-featured-parties`);
    },

    // Checks the RSVP status for a particular party by a patron
    checkStatus: async (partyId, patronId) => {
        // Sends a GET request to check if the patron has RSVP'd for the party
        return await api.get(`${API_BASE_URL}/party/rsvp/${partyId}/check/${patronId}`);
    },

    // Allows a patron to RSVP to a party
    RSVP: async (partyId, patronId) => {
        // Sends a POST request to RSVP for the party with partyId and patronId
        return await api.post(`${API_BASE_URL}/party/rsvp`, { partyId, patronId });
    },

    // Allows a patron to cancel their RSVP to a party
    cancelRSVP: async (partyId, patronId) => {
        // Sends a POST request to cancel the RSVP for the given partyId and patronId
        return await api.post(`${API_BASE_URL}/party/rsvp/cancel`, { partyId, patronId });
    },

    // Allows a user to follow a host
    followHost: async (userId, hostId) => {
        // Sends a POST request to follow the host with hostId for the user with userId
        return await api.post(`${API_BASE_URL}/party/feed/follow-host`, { userId, hostId });
    },

    // Allows a user to unfollow a host
    unfollowHost: async (userId, hostId) => {
        // Sends a POST request to unfollow the host with hostId for the user with userId
        return await api.post(`${API_BASE_URL}/party/feed/unfollow-host`, { userId, hostId });
    }
}