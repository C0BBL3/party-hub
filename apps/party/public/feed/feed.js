class FeedScreen {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.partyListDiv = $('partyList');
        this.filters = {
            startDay: $('filter-startDay'),
            startTime: $('filter-startTime'),
            // following: $('filter-following'),
            // friends: $('filter-friends'),
            vibes: $('filter-vibes')
        };

        for (let filter of Object.values(this.filters)) {
            filter.onchange = this.filterParties.bind(this);
        }

        // Placeholder for dynamically loaded parties
        this.parties = await this.getFirst10Parties();

        this.addVibeFilters();

        await this.delay(250);

        this.loadParties(this.parties);
    }

    async getFirst10Parties() {
        const result = await api.feed.getFirst10Parties();

        if (result) {
            let parties = [];

            for (let party_ of result.parties) {
                let party = {
                    title: party_.title,
                    startTime: party_.startTime,
                    description: party_.description,
                    vibes: this.capitalize(party_.vibes)
                };

                parties.push(party);
            }

            return parties;
        }

        return [];
    }

    addVibeFilters() {
        let vibes = [];
        
        for (let party of this.parties) {
            let partyVibes = party.vibes.split(',');

            for (let vibe of partyVibes) {
                if (!vibes.includes(vibe)) {
                    vibes.push(vibe);
                }
            }
        }

        for (let vibe of vibes) {
            let option = Core.createElement(this.filters.vibes, 'option', vibe);
            option.innerHTML = vibe;
        }
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

    getNextDayTime(day, time) {
        // Days of the week map
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Get the current date and day index
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        // Parse time (e.g., "9:00 PM")
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        
        // Convert hour to 24-hour format
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        
        // Find target day index
        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided.");
        
        // Calculate days until the target day
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7;
        }
        
        // Create the Date object for the target day and time
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0);
        
        return targetDate;
    }

    capitalize(vibes) {
        const parts = vibes.split(',');
        
        const capitalizedItems = [];
        
        for(let vibe of parts) {
            const lowerCase = vibe.toLowerCase();
            const fLetter = lowerCase.slice(0, 1).toUpperCase();
            const rletters = lowerCase.slice(1, lowerCase.length);
            const finalVibe = fLetter + rletters;
            
            capitalizedItems.push(finalVibe);
        }
        
        const capitalized = capitalizedItems.join(',');
        
        return capitalized;
    }

    async loadParties(filteredParties) {
        this.partyListDiv.innerHTML = ""; // Clear list

        for (let party of filteredParties) {
            const item = Core.createDiv(this.partyListDiv, '', 'party-item');
            const title = Core.createElement(item, 'h3', '', '', party.title);
            const theme = Core.createElement(item, 'p', '', '', party.vibes);
            const rating = Core.createElement(item, 'p', '', '', moment(party.startTime).format('LLLL'));
            const venue = Core.createElement(item, 'p', '', '', party.description);
        }
    }

    filterParties() {
        let startTime = this.getNextDayTime(this.filters.startDay.value, this.filters.startTime.value);
        let startTimeUnix = startTime.getTime();

        const filtered = this.parties.filter(party => {
            let partyStartTimeUnix = new Date(party.startTime).getTime();
            let partyHasSelectedVibe = party.vibes.split(',').includes(this.filters.vibes.value);

            return (
                (startTimeUnix <= partyStartTimeUnix) &&
                (this.filters.vibes.value === "all" || partyHasSelectedVibe)
                // (this.filters.rating.value === "all" || Math.floor(party.rating) >= parseInt(this.filters.rating.value)) &&
                // (this.filters.theme.value === "all" || this.filters.theme.value === party.theme.toLowerCase()) &&
                // (this.filters.venue.value === "all" || this.filters.venue.value === party.venue.toLowerCase())
            );
        });
        this.loadParties(filtered);
    }


}

let feedScreen = new FeedScreen();