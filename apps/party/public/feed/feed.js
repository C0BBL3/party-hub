class FeedScreen {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.partyListDiv = $('partyList');
        this.filters = {
            rating: $('filter-rating'),
            following: $('filter-following'),
            friends: $('filter-friends'),
            theme: $('filter-theme'),
            venue: $('filter-venue'),
        };

        for (let filter of Object.values(this.filters)) {
            filter.onchange = this.filterParties.bind(this);
        }

        // Placeholder for dynamically loaded parties
        this.parties = [
            { name: "Party Name 1", theme: "Beach", rating: 4.5, venue: "Bar" },
            { name: "Party Name 2", theme: "Halloween", rating: 4.8, venue: "House" },
            { name: "Party Name 3", theme: "Formal", rating: 3.9, venue: "House" },
            // Add more parties as needed
        ];

        this.loadParties(this.parties);
    }

    loadParties(filteredParties) {
        this.partyListDiv.innerHTML = ""; // Clear list

        for (let party of filteredParties) {
            const item = Core.createDiv(this.partyListDiv, '', 'party-item');
            const title = Core.createElement(item, 'h3', '', '', party.name);
            const theme = Core.createElement(item, 'p', '', '', party.theme);
            const rating = Core.createElement(item, 'p', '', '', party.rating);
            const venue = Core.createElement(item, 'p', '', '', party.venue);
        }
    }

    filterParties() {
        const filtered = this.parties.filter(party => {
            return (
                (this.filters.rating.value === "all" || Math.floor(party.rating) >= parseInt(this.filters.rating.value)) &&
                (this.filters.theme.value === "all" || this.filters.theme.value === party.theme.toLowerCase()) &&
                (this.filters.venue.value === "all" || this.filters.venue.value === party.venue.toLowerCase())
            );
        });
        this.loadParties(filtered);
    }
}

let feedScreen = new FeedScreen();