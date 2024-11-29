const BASE_PATH = `${API_BASE_URL}/host/edit`;

api.edit = {
    requestEditParty: async (partyId, userId, privacy, startTime, vibes, description) => {
        return await api.post(`${BASE_PATH}/request-edit-party`, {
            partyId,
            userId,
            privacy,
            startTime,
            vibes,
            description
        });
    }
}