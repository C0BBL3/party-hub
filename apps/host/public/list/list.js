/*
Dynamically manages the List screen and its behaviors
Author: Colby Roberts
*/
class List {
    constructor() {
        document.body.onload = this.init.bind(this); // Initializes the class when the page loads
    }

    async init() {
        this.userId = parseInt($('userId').value); // Fetch userId from the DOM
        this.container = $('container'); // Get the container where the parties will be displayed

        // Fetch upcoming and past parties for the user
        this.upcomingParties = await this.getUpcomingParties();
        this.pastParties = await this.getPastParties();

        await this.delay(250); // Small delay to allow DOM rendering

        this.loadParties(); // Load the parties into the container
    }

    loadParties() {
        this.container.innerHTML = ''; // Clear the existing content in the container

        // If there are upcoming parties, create a section for them
        if (this.upcomingParties.length > 0) {
            this.upcomingPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Upcoming Parties');
            this.upcomingPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            // Create a div for each upcoming party and add it to the container
            for (let party of this.upcomingParties) {
                const partyDiv = this.createPartyDiv(party, true); // 'true' indicates it's an upcoming party
                this.upcomingPartiesContainer.appendChild(partyDiv);
            }
        }

        // If there are past parties, create a section for them
        if (this.pastParties.length > 0) {
            this.pastPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Past Parties');
            // Add a border to separate past parties from upcoming ones
            if (this.upcomingParties.length > 0) {
                this.pastPartiesHeader.style.borderTop = '1px solid var(--lighter-grey-color)';
                this.pastPartiesHeader.style.marginTop = '20px';
            }
            this.pastPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            // Create a div for each past party and add it to the container
            for (let party of this.pastParties) {
                const partyDiv = this.createPartyDiv(party); // Default is a past party
                this.pastPartiesContainer.appendChild(partyDiv);
            }
        }
    }

    createPartyDiv(party, upcoming = false) {
        // Create the outer div for a party
        const partyDiv = Core.createDiv(this.partyListDiv, `party-${party.id}`, 'party-div');
        const shadow = Core.createDiv(partyDiv, `party-${party.id}-shadow`, 'party-shadow');
        const container = Core.createDiv(partyDiv, `party-${party.id}-container`, 'party-container');

        // Set up the party image (either the party's image or the host's image if none exists)
        let image;
        if (party.pictureBase64) {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.pictureBase64);
        } else {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.host.pictureBase64);
        }

        // Create text container with party details
        const textContainer = Core.createDiv(container, `party-${party.id}-textContainer`, 'party-textContainer');
        const titleContainer = Core.createDiv(textContainer, `party-${party.id}-titleContainer`, 'party-titleContainer');
        const title = Core.createSpan(titleContainer, `party-${party.id}-title`, 'party-title', party.title);

        // Add a "share" button for upcoming parties
        if (upcoming || true) {
            const share = Core.createSpan(titleContainer, `party-${party.id}-share`, 'party-share', `
                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z"/>
                </svg>
            `);
            share.onclick = this.onClickShareParty.bind(this, party); // Handle sharing
        }

        // Add party start time, address, privacy, and RSVP count
        const subtitleContainer = Core.createDiv(textContainer, `party-${party.id}-subtitleContainer`, 'party-subtitleContainer');
        const startTime = Core.createSpan(subtitleContainer, `party-${party.id}-startTime`, 'party-startTime', moment(party.startTime).format('MMM D, h:mm A'));
        const address = Core.createSpan(subtitleContainer, `party-${party.id}-address`, 'party-address', party.address.streetAddress);
        const privacy = Core.createSpan(subtitleContainer, `party-${party.id}-privacy`, 'party-privacy', party.privacy);
        const rsvp = Core.createSpan(subtitleContainer, `party-${party.id}-rsvp`, 'party-rsvp', `${party.rsvpCount} / 100 Patrons`);

        // Add vibes to the party
        const vibesContainer = Core.createDiv(textContainer, `party-${party.id}-vibes`, 'party-vibes');
        let vibes = this.capitalize(party.vibes.trim());

        for (let vibe of vibes) {
            if (vibe.trim().length == 0) { continue; }
            const vibeDiv = Core.createDiv(vibesContainer, `party-${party.id}-vibe-${vibe}`, 'party-vibe', vibe);
            if (upcoming) {
                vibeDiv.onclick = this.onClickPartyDiv.bind(this); // Handle party div clicks for upcoming parties
            }
        }

        // Add the party description
        const description = Core.createSpan(textContainer, `party-${party.id}-description`, 'party-description', party.description);

        // Set up click handlers for various elements (if upcoming)
        if (upcoming) {
            partyDiv.style.cursor = 'pointer';
            partyDiv.onclick = this.onClickPartyDiv.bind(this); 
            container.onclick = this.onClickPartyDiv.bind(this); 
            image.onclick = this.onClickPartyDiv.bind(this); 
            textContainer.onclick = this.onClickPartyDiv.bind(this); 
            title.onclick = this.onClickPartyDiv.bind(this); 
            subtitleContainer.onclick = this.onClickPartyDiv.bind(this); 
            startTime.onclick = this.onClickPartyDiv.bind(this); 
            address.onclick = this.onClickPartyDiv.bind(this); 
            privacy.onclick = this.onClickPartyDiv.bind(this); 
            rsvp.onclick = this.onClickPartyDiv.bind(this); 
            vibesContainer.onclick = this.onClickPartyDiv.bind(this); 
            description.onclick = this.onClickPartyDiv.bind(this); 
        }

        return partyDiv; // Return the created party div
    }

    async onClickShareParty(party, evt) {
        evt.stopPropagation();

        // Get the party link from the API
        const partyLink = await api.list.getPartyLink(this.userId, party.id);

        if (partyLink.result) {
            await this.delay(250);

            // Create a context menu to display the party link
            const title = 'Share Party';
            let message;

            if (party.privacy == 'Private') {
                message = 'Anyone of your friends with the link can join the party!';
            } else {
                message = 'Anyone with the link can join the party!';
            }

            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.createInput(partyLink.link);
            contextMenu.input.value = partyLink.link;
            contextMenu.input.disabled = true;
            contextMenu.input.style.marginTop = '10px';
            contextMenu.input.style.textAlign = 'center';
            contextMenu.setHeight('190');

            await contextMenu.showSync(); // Show the context menu to the user
        }
    }

    async onClickPartyDiv(evt) {
        evt.stopPropagation();

        // Get the party ID from the clicked element and find the party details
        let target = evt.target;
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        let party;
        for (let party_ of this.upcomingParties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }

        // Prompt the user to confirm if they want to edit the party
        const title = 'Edit';
        const message = `Do you wish to edit ${party.title}?`
        const contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'YES');
        contextMenu.div.style.height = '150px';

        const choice = await contextMenu.showSync();

        if (choice) {
            window.location.href = `/host/edit?id=${party.id}`; // Redirect to edit page
        }
    }

    async getUpcomingParties() {
        // Fetch upcoming parties from the API
        const parties = await api.list.getUpcomingParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.upcoming);
    }

    async getPastParties() {
        // Fetch past parties from the API
        const parties = await api.list.getPastParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.past);
    }

    parsePartyAPIResult(upcomingParties) {
        let parties = [];

        // Parse each party's details from the API response
        for (let party_ of upcomingParties) {
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
                address: party_.address
            };

            parties.push(party);
        }

        return parties; // Return parsed party details
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

        return capitalizedItems; // Return capitalized vibes
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {

                resolve(null);
            }, timeMS);
        });
    }
}

const list = new List();