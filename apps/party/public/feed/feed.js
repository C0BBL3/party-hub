class FeedScreen {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.userId = parseInt($('userId').value);
        this.partyListDiv = $('partyList');
        this.filters = {
            startDay: $('filter-startDay'),
            startTime: $('filter-startTime'),
            discoverability: $('filter-discoverability'),
            vibes: $('filter-vibes')
        };

        for (let filter of Object.values(this.filters)) {
            filter.onchange = this.filterParties.bind(this);
        }

        // Placeholder for dynamically loaded parties
        this.parties = await this.getFeaturedParties();

        this.addVibeFilters();

        await this.delay(250);

        this.loadParties(this.parties);
    }

    async getFeaturedParties() {
        const result = await api.feed.getFeaturedParties();

        if (result) {
            let parties = [];

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

                parties.push(party);
            }

            return parties;
        }

        return [];
    }

    addVibeFilters() {
        let vibes = [];
        
        for (let party of this.parties) {
            let partyVibes = [party.vibes.trim(), party.host.tags.trim()].join(',').split(',');
            

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
        if (time == 'all') {
            time = '8:00 PM';
        }
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
            
            if (capitalizedItems.includes(finalVibe)) {
                continue;
            }

            capitalizedItems.push(finalVibe);
        }

        return capitalizedItems;
    }

    async loadParties(filteredParties) {
        this.onMouseExitPartyDivTimeout = null;
        this.partyListDiv.innerHTML = ""; // Clear list

        if (filteredParties.length == 0) {
            this.partyListDiv.innerHTML = "Hmm... it seems we've run out of featured parties. Please try again at another time!"; 
        }

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
            
            for (let vibe of vibes) {
                if (vibe.trim().length == 0) { continue; }
                const vibeDiv = Core.createDiv(vibesContainer, `party-${party.id}-vibe-${vibe}`, 'party-vibe', vibe);
                vibeDiv.onclick = this.onClickPartyVibe.bind(this);
            }

            const description = Core.createSpan(textContainer, `party-${party.id}-description`, 'party-description', party.description);
            description.onclick = this.onClickPartyDiv.bind(this);
        }
    }

    onClickPartyVibe(evt) {
        let target = evt.target;
        let vibeSpan;

        if (target.className == 'party-vibes' || target.className == 'party-host-span' || target.className == 'party-host' || target.className == 'party-startTime' || target.className == 'party-subtitleContainer') {
            return;
        } else {
            vibeSpan = target;
        }

        let parts = vibeSpan.id.split('-');
        let vibe = parts[3]

        this.filters.vibes.value = vibe;
        this.filterParties();
    }

    async onClickHost(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        let target = evt.target;   
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        let party;
        for (let party_ of this.parties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }   

        const title = 'View Host';

        const hostDiv = Core.createDiv(null, `host-${party.host.id}`, 'host-div');
        const mainContainer = Core.createDiv(hostDiv, `host-${party.host.id}-main-container`, 'host-main-container')
        const image = Core.createImg(mainContainer, `host-${party.host.id}-image`, 'host-image', party.host.pictureBase64);
        const mainInfo = Core.createDiv(mainContainer, `host-${party.host.id}-main-info`, 'host-main-info');
        const usernameContainer = Core.createDiv(mainInfo, `host-${party.host.id}-username-container`, 'host-username');
        const username = Core.createSpan(usernameContainer, `host-${party.host.id}-username`, 'host-username', party.host.username);
        
        const follow = Core.createDiv(usernameContainer, `host-${party.host.id}-follow`, 'host-follow', 'Follow');        
        const following = Core.createDiv(usernameContainer, `host-${party.host.id}-following`, 'host-follow', 'Following');

        if (party.discoverability > 0) {
            follow.style.display = 'none';
        } else {
            following.style.display = 'none';
        }

        follow.onclick = this.onClickHostFollow.bind(this, party.host);
        following.onclick = this.onClickHostFollowing.bind(this, party.host);

        const vibesContainer = Core.createDiv(mainInfo, `party-${party.id}-vibes`, 'host-vibes');

        if (party.host.vibes == null) {
            vibesContainer.innerHTML = 'This host not entered the vibes they give off.'
        } else {
            let vibes = this.capitalize(party.host.vibes);
            
            for (let vibe of vibes) {
                const vibeDiv = Core.createDiv(vibesContainer, `host-${party.host.id}-vibe-${vibe}`, 'host-vibe', vibe);
            }
        }

        let descriptionInnerHTML = party.host.description != null ? party.host.description : 'This host has not entered a description.'
        const description = Core.createSpan(hostDiv, `host-${party.host.id}-description`, 'host-description', descriptionInnerHTML);

        const contextMenu = new ContextMenu(title, '', null, 'OK');
        contextMenu.createElement(hostDiv);
        contextMenu.div.style.height = party.host.description != null ? '415px' : '320px';

        const choice = await contextMenu.showSync();
    }

    async onClickHostFollow(host, evt) {
        evt.stopPropagation();
        evt.preventDefault();

        let party;
        for (let party_ of this.parties) {
            if (party_.host.id == host.id) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }

        if (party.discoverability > 0) {
            return;
        }

        const follow = await api.feed.followHost(this.userId, host.id);

        if (follow.result) {
            $(`host-${host.id}-follow`).style.display = 'none';
            $(`host-${host.id}-following`).style.display = 'block';

            this.parties = await this.getFeaturedParties();
            this.filterParties();
        }
    }

    async onClickHostFollowing(host, evt) {
        evt.stopPropagation();
        evt.preventDefault();

        let party;
        for (let party_ of this.parties) {
            if (party_.host.id == host.id) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }

        if (party.discoverability == 0) {
            return;
        }

        const unfollow = await api.feed.unfollowHost(this.userId, host.id);

        if (unfollow.result) {
            $(`host-${host.id}-following`).style.display = 'none';
            $(`host-${host.id}-follow`).style.display = 'block';
           
            this.parties = await this.getFeaturedParties();
            this.filterParties();
        } 
    }

    async onClickPartyDiv(evt) {
        evt.stopPropagation();
        let target = evt.target;
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        let party;
        for (let party_ of this.parties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }

        let userId = parseInt($('userId').value);

        let status = await api.feed.checkStatus(partyId, userId);

        await this.delay(250);

        let title, message, contextMenu;

        if (status.result && status.enabled) {
            title = 'RSVP';
            message = `You've already RSVP'ed for ${party.title}. Would you like to cancel?`;
    
            contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'CANCEL');
            $('context-menu').style.height = '160px';

            const choice = await contextMenu.showSync();

            if (choice) {
                let cancel = await api.feed.cancelRSVP(partyId, userId);

                await this.delay(500);

                title = cancel.result ? 'RSVP' : 'OOPS...';

                if (cancel.result) {
                    message = `You have canceled your RSVP at ${party.title}.`;
                } else {
                    message = `There seems to be an error please try again at another time...`;
                }

                contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = cancel.result ? '150px' : '160px';

                await contextMenu.showSync();
            }
        } else {
            title = 'RSVP';
            message = `Would you like to RSVP for ${party.title}?`;

            contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'PARTY TIME!');
            $('context-menu').style.height = '150px';

            const choice = await contextMenu.showSync();

            if (choice) {
                let rsvp = await api.feed.RSVP(partyId, userId);

                await this.delay(500);

                title = rsvp.result ? 'RSVP' : 'OOPS...';

                if (rsvp.result) {
                    message = `You have reserved a spot at ${party.title}.`;
                } else {
                    message = `There seems to be an error please try again at another time...`;
                }

                contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = rsvp.result ? '150px' : '160px';

                await contextMenu.showSync();
            }
        }
    }

    onClickPrivacy(evt) {
        evt.stopPropagation();
        let target = evt.target;
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        let party;
        for (let party_ of this.parties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }

        let userId = parseInt($('userId').value);

        let privacy = target.innerHTML;

        if (privacy == 'Discoverable') {
            this.filters.discoverability.value = 0;
        } else if (privacy == 'Public') {
            this.filters.discoverability.value = 1;
        }

        this.filterParties();
    }

    filterParties() {
        const filtered = this.parties.filter(party => {
            let partyVibes = [party.vibes.trim(), party.host.tags.trim()].join(',')
            let partyHasSelectedVibe = partyVibes.split(',').includes(this.filters.vibes.value);
            let startBool = this.getStartTimeBool(party);

            return (
                startBool &&
                (this.filters.vibes.value === "all" || partyHasSelectedVibe) &&
                // (this.filters.rating.value === "all" || Math.floor(party.rating) >= parseInt(this.filters.rating.value)) &&
                // (this.filters.theme.value === "all" || this.filters.theme.value === party.theme.toLowerCase()) &&
                // (this.filters.venue.value === "all" || this.filters.venue.value === party.venue.toLowerCase()) &&
                (party.discoverability >= parseInt(this.filters.discoverability.value))
            );
        });

        this.loadParties(filtered);
    }

    getStartTimeBool(party) {
        if (this.filters.startDay.value == 'all' && this.filters.startTime.value == 'all') { // user has no start filters applied
            return true;
        } else if (this.filters.startDay.value != 'all' && this.filters.startTime.value == 'all') { // user has start day filter but no start time filter
            let partyStartTime = new Date(party.startTime);
            let days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            let partyStartDay = days[partyStartTime.getDay()];
            return this.compareDays(this.filters.startDay.value, partyStartDay) == 'eq';
        } else if (this.filters.startDay.value == 'all' && this.filters.startTime.value != 'all') { // user has start time filter but no start day filter
            let partyStartTime = new Date(party.startTime);
            let partyStartHour = moment(partyStartTime).format('h:mm A');
            return this.compareTime(this.filters.startTime.value, partyStartHour) == 'eq';
        } else { // if (this.filters.startDay.value != 'all' && this.filters.startTime.value != 'all') { // user has both start day and time filters applied
            let startTime = this.getNextDayTime(this.filters.startDay.value, this.filters.startTime.value);
            let startTimeUnix = startTime.getTime();
            let partyStartTimeUnix = new Date(party.startTime).getTime();
            return startTimeUnix == partyStartTimeUnix;
        }       
    }

    compareDays(day1, day2) {
        if (day1.toLowerCase() == day2.toLowerCase()) {
            return 'eq';
        }

        if ((day1.toLowerCase() == 'monday') && (day2.toLowerCase() == 'sunday')) {
            return 'geq';
        }

        if ((day2.toLowerCase() == 'monday') && (day1.toLowerCase() == 'sunday')) {
            return 'leq';
        }

        let days = {
            'monday': 1,
            'tuesday': 2,
            'wednesday': 3,
            'thursday': 4,
            'friday': 5,
            'saturday': 6,
            'sunday': 7,
        };

        let day1Int = days[day1.toLowerCase()];
        let day2Int = days[day2.toLowerCase()];

        if (day1Int > day2Int) {
            return 'geq';
        } else if (day1Int < day2Int) {
            return 'leq';
        }

        return 'eq';
    }

    compareTime(time1, time2) {
        let parts1 = time1.split(':');
        let parts2 = time2.split(':');

        let hour1 = parseInt(parts1);
        let hour2 = parseInt(parts2);

        if (hour1 > hour2) {
            return 'geq';
        } else if (hour1 < hour2) {
            return 'leq';
        }

        let minute1 = parseInt(parts1[1].split(' ')[0]);
        let minute2 = parseInt(parts2[1].split(' ')[0]);

        if (minute1 > minute2) {
            return 'geq';
        } else if (minute1 < minute2) {
            return 'leq';
        }

        return 'eq';
    }


}

let feedScreen = new FeedScreen();