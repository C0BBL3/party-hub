document.addEventListener('DOMContentLoaded', () => {
    const partyList = document.getElementById('partyList');
    const filters = {
        rating: document.getElementById('filter-rating'),
        following: document.getElementById('filter-following'),
        friends: document.getElementById('filter-friends'),
        theme: document.getElementById('filter-theme'),
        venue: document.getElementById('filter-venue'),
    };

    // Placeholder for dynamically loaded parties
    const parties = [
        { name: "Party Name 1", theme: "Beach", rating: 4.5, venue: "Bar" },
        { name: "Party Name 2", theme: "Halloween", rating: 4.8, venue: "House" },
        { name: "Party Name 3", theme: "Formal", rating: 3.9, venue: "House" },
        // Add more parties as needed
    ];

    function loadParties(filteredParties) {
        partyList.innerHTML = ""; // Clear list
        filteredParties.forEach(party => {
            const item = document.createElement('div');
            item.className = 'party-item';
            item.innerHTML = `
                <h3>${party.name}</h3>
                <p>Theme: ${party.theme}</p>
                <p>Rating: ${party.rating} ⭐</p>
                <p>Venue: ${party.venue}</p>
            `;
            partyList.appendChild(item);
        });
    }

    function filterParties() {
        const filtered = parties.filter(party => {
            return (
                (filters.rating.value === "all" || Math.floor(party.rating) === parseInt(filters.rating.value)) &&
                (filters.theme.value === "all" || filters.theme.value === party.theme.toLowerCase()) &&
                (filters.venue.value === "all" || filters.venue.value === party.venue.toLowerCase())
            );
        });
        loadParties(filtered);
    }

    // Attach filter logic to dropdowns
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', filterParties);
    });

    // Initial load
    loadParties(parties);
});
