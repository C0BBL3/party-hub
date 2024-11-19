api.feed = {
    getFirst10Parties: async () => {
        return await api.get(`${API_BASE_URL}/party/feed/get-first-10-parties`);
    }
}