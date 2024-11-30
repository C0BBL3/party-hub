const BASE_PATH = `${API_BASE_URL}/settings/profile`;

api.profile = {
    updateProfilePicture: async (userId, pictureBase64) => {
        return await api.post(`${BASE_PATH}/update-profile-picture`, { userId, pictureBase64 });
    },
    updateName: async (userId, firstName, lastName) => {
        return await api.post(`${BASE_PATH}/update-name`, { userId, firstName, lastName });
    },
    updateDescription: async (userId, description) => {
        return await api.post(`${BASE_PATH}/update-description`, { userId, description });
    },
    updateVibes: async (userId, vibes) => {
        return await api.post(`${BASE_PATH}/update-tags`, { userId, tags: vibes });
    }
}