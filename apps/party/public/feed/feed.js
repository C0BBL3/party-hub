/*
Dynamically manages the Feed screen and its behaviors
Author Jack Davy, Colby Roberts
*/
class FeedScreen {
    constructor() {
        document.body.onload = this.init.bind(this); // When the body loads, initialize the Feed screen.
    }

    async init() {
        this.userId = parseInt($('userId').value); // Get the user ID from the page.
        this.partyListDiv = $('partyList'); // Get the div where party list will be rendered.
        this.filters = {
            startDay: $('filter-startDay'), // Start day filter.
            startTime: $('filter-startTime'), // Start time filter.
            discoverability: $('filter-discoverability'), // Discoverability filter.
            vibes: $('filter-vibes') // Vibes filter.
        };

        // Adding change event listeners to filters.
        for (let filter of Object.values(this.filters)) {
            filter.onchange = this.filterParties.bind(this);
        }

        // Placeholder for dynamically loaded parties
        this.parties = await this.getFeaturedParties(); // Fetch the featured parties from the API.

        this.addVibeFilters(); // Add vibe filters based on the fetched parties.

        await this.delay(250); // Wait for 250ms before loading parties.

        this.loadParties(this.parties); // Load the parties onto the page.
    }

    // Fetches featured parties from the API
    async getFeaturedParties() {
        const result = await api.feed.getFeaturedParties(); // Call API to get featured parties.

        if (result) {
            let parties = [];

            // Loop through each party in the result and format it.
            for (let party_ of result.parties) {
                let party = {
                    id: party_.id,
                    title: party_.title,
                    startTime: party_.startTime,
                    description: party_.description,
                    vibes: this.capitalize(party_.vibes).join(','),
                    pictureBase64: party_.pictureBase64,
                    privacy: party_.privacy,
                    host: party_.host,
                    rsvpCount: party_.rsvpCount,
                    discoverability: party_.discoverability,
                    friendCount: party_.friendCount,
                    otherCount: party_.otherCount,
                    address: party_.address
                };

                parties.push(party); // Add formatted party to the array.
            }

            return parties; // Return the array of formatted parties.
        }

        return []; // If no parties are returned, return an empty array.
    }

    // Adds the vibe filters dynamically based on the fetched parties.
    addVibeFilters() {
        let vibes = [];
        
        // Collect all unique vibes from parties and hosts.
        for (let party of this.parties) {
            let partyVibes = [party.vibes.trim(), party.host.tags.trim()].join(',').split(',');

            // Add each vibe to the vibes list if it is not already included.
            for (let vibe of partyVibes) {
                if (!vibes.includes(vibe)) {
                    vibes.push(vibe);
                }
            }
        }

        // Create an option element for each unique vibe and append to the vibes filter.
        for (let vibe of vibes) {
            let option = Core.createElement(this.filters.vibes, 'option', vibe);
            option.innerHTML = vibe;
        }
    }

    // Delay function that returns a Promise that resolves after the specified time.
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

    // Get the next occurrence of a specific day and time.
    getNextDayTime(day, time) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        // If no specific time is given, default to '8:00 PM'.
        if (time == 'all') {
            time = '8:00 PM';
        }
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        
        // Convert hour to 24-hour format.
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        
        // Find target day index
        const targetDayIndex = daysOfWeek.indexOf(day);
        if (targetDayIndex === -1) throw new Error("Invalid day provided.");
        
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7; // Calculate how many days until the target day.
        
        if (daysUntilTarget === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
            daysUntilTarget = 7; // If the target time is already passed today, get the next occurrence.
        }
        
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        targetDate.setHours(hour, minute, 0, 0); // Set the target date and time.

        return targetDate;
    }

    // Capitalize the first letter of each vibe.
    capitalize(vibes) {
        const parts = vibes.split(',');
        const capitalizedItems = [];
        
        // Capitalize each vibe and add to the list if not already present.
        for(let vibe of parts) {
            const lowerCase = vibe.toLowerCase();
            const fLetter = lowerCase.slice(0, 1).toUpperCase();
            const rletters = lowerCase.slice(1);
            const finalVibe = fLetter + rletters;
            
            if (capitalizedItems.includes(finalVibe)) {
                continue;
            }

            capitalizedItems.push(finalVibe);
        }

        return capitalizedItems;
    }

    // Loads filtered parties into the party list div.
    async loadParties(filteredParties) {
        this.onMouseExitPartyDivTimeout = null;
        this.partyListDiv.innerHTML = ""; // Clear the party list.

        if (filteredParties.length == 0) {
            this.partyListDiv.innerHTML = "Hmm... it seems we've run out of featured parties. Please try again at another time!"; 
        }

        // Loop through the filtered parties and create the party divs.
        for (let party of filteredParties) {
            const partyDiv = Core.createDiv(this.partyListDiv, `party-${party.id}`, 'party-div');
            partyDiv.onclick = this.onClickPartyDiv.bind(this);

            const shadow = Core.createDiv(partyDiv, `party-${party.id}-shadow`, 'party-shadow');
            const container = Core.createDiv(partyDiv, `party-${party.id}-container`, 'party-container');

            container.onclick = this.onClickPartyDiv.bind(this);

            let image;
            if (party.pictureBase64) {
                image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.pictureBase64);
            } else {
                image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.host.pictureBase64);
            }

            image.onclick = this.onClickPartyDiv.bind(this);

            const textContainer = Core.createDiv(container, `party-${party.id}-textContainer`, 'party-textContainer');
            textContainer.onclick = this.onClickPartyDiv.bind(this);
            
            const title = Core.createSpan(textContainer, `party-${party.id}-title`, 'party-title', party.title);
            title.onclick = this.onClickPartyDiv.bind(this);

            const subtitleContainer = Core.createDiv(textContainer, `party-${party.id}-subtitleContainer`, 'party-subtitleContainer');
            subtitleContainer.onclick = this.onClickPartyDiv.bind(this);
            
            const hostSpan = Core.createSpan(subtitleContainer, `party-${party.id}-host-span`, 'party-host-span');
            const hostByText = Core.createText(hostSpan, 'Hosted by ');
            const host = Core.createAnchor(hostSpan, `party-${party.id}-host-${party.host.id}`, 'party-host', party.host.username);
            host.onclick = this.onClickHost.bind(this);

            const startTime = Core.createSpan(subtitleContainer, `party-${party.id}-startTime`, 'party-startTime', moment(party.startTime).format('MMM D, h:mm A'));
            startTime.onclick = this.onClickPartyDiv.bind(this);

            const address = Core.createSpan(subtitleContainer, `party-${party.id}-address`, 'party-address', party.address.streetAddress);
            address.onclick = this.onClickPartyDiv.bind(this);

            const privacy = Core.createSpan(subtitleContainer, `party-${party.id}-privacy`, 'party-privacy', party.privacy);
            privacy.onclick = this.onClickPrivacy.bind(this);

            const rsvp = Core.createSpan(subtitleContainer, `party-${party.id}-rsvp`, 'party-rsvp', `${party.rsvpCount} / 100 Patrons`);
            rsvp.onclick = this.onClickPartyDiv.bind(this);

            const vibesContainer = Core.createDiv(textContainer, `party-${party.id}-vibes`, 'party-vibes');
            vibesContainer.onclick = this.onClickPartyDiv.bind(this);

            let vibes = this.capitalize([party.vibes.trim(), party.host.tags.trim()].join(','));
            
            // Add each vibe as a div element.
            for (let vibe of vibes) {
                if (vibe.trim().length == 0) { continue; }
                const vibeDiv = Core.createDiv(vibesContainer, `party-${party.id}-vibe-${vibe}`, 'party-vibe', vibe);
                vibeDiv.onclick = this.onClickPartyVibe.bind(this);
            }

            // Add the party description.
            const description = Core.createSpan(textContainer, `party-${party.id}-description`, 'party-description', party.description);
            description.onclick = this.onClickPartyDiv.bind(this);
        }
    }

    // Event handler for clicking a party vibe.
    onClickPartyVibe(evt) {
        let vibe = evt.target.innerHTML;
        this.filters.vibes.value = vibe;
        this.filterParties();
    }

    // Event handler for clicking a privacy setting.
    onClickPrivacy(evt) {
        alert(`Privacy setting is ${evt.target.innerHTML}`);
    }

    // Event handler for clicking a host.
    onClickHost(evt) {
        evt.stopPropagation();
        alert(`Go to the host's profile at /user/${evt.target.dataset.userId}`);
    }

    // Event handler for clicking a party.
    onClickPartyDiv(evt) {
        alert(`Go to the party details for party ${evt.target.dataset.partyId}`);
    }

    // Event handler for filtering parties based on filters.
    async filterParties() {
        const filterValues = {
            startDay: this.filters.startDay.value,
            startTime: this.filters.startTime.value,
            discoverability: this.filters.discoverability.value,
            vibes: this.filters.vibes.value
        };

        let filteredParties = this.parties.filter((party) => {
            return this.filterByDay(party, filterValues.startDay)
                && this.filterByTime(party, filterValues.startTime)
                && this.filterByDiscoverability(party, filterValues.discoverability)
                && this.filterByVibe(party, filterValues.vibes);
        });

        this.loadParties(filteredParties); // Load the filtered parties onto the screen.
    }

    // Check if a party matches the selected day filter.
    filterByDay(party, startDay) {
        if (startDay === 'all') return true;
        let partyDay = moment(party.startTime).format('dddd');
        return partyDay === startDay;
    }

    // Check if a party matches the selected time filter.
    filterByTime(party, startTime) {
        if (startTime === 'all') return true;
        return moment(party.startTime).format('h:mm A') === startTime;
    }

    // Check if a party matches the selected discoverability filter.
    filterByDiscoverability(party, discoverability) {
        return discoverability === 'all' || party.discoverability === discoverability;
    }

    // Check if a party matches the selected vibe filter.
    filterByVibe(party, vibe) {
        return vibe === 'all' || party.vibes.includes(vibe);
    }
}