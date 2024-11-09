const BASE_PATH = `${API_BASE_URL}/host/create`;

api.create = {
    checkIfUniquePartyTitle: async (partyTitle) => {
        return await api.get(`${BASE_PATH}/check-if-unique-party-title/${partyTitle}`);
    },
    requestCreateParty: async (title, address, privacy, start, vibes, description) => {
        return await api.post(`${BASE_PATH}/request-create-party`, {
            title,
            address,
            privacy,
            start,
            vibes,
            description
        });
    }
}