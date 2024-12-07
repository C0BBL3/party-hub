/*
Sets up the API for the Edit screen
Author Colby Roberts
*/
const BASE_PATH = `${API_BASE_URL}/host/edit`;

api.edit = {
    requestEditParty: async (partyId, userId, privacy, startTime, vibes, description, pictureBase64) => {
        return await api.post(`${BASE_PATH}/request-edit-party`, {
            partyId,
            userId,
            privacy,
            startTime,
            vibes,
            description,
            pictureBase64
        });
    }
}