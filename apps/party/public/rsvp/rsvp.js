/*
Dynamically manages the RSVP screen and its behaviors
Author Jack Davy, Colby Roberts
*/
class RSVP {
    constructor() {
        // Initializing the class when the body is loaded
        document.body.onload = this.init.bind(this);
    }

    async init() {
        // Get the user ID and container for the parties
        this.userId = parseInt($('userId').value);
        this.container = $('container');

        // Fetch upcoming and past parties data asynchronously
        this.upcomingParties = await this.getUpcomingParties();
        this.pastParties = await this.getPastParties();

        // Delay to ensure data is fetched before rendering
        await this.delay(250);

        // Render the parties on the screen
        this.loadParties();
    }

    loadParties() {
        // Clear the container before loading new parties
        this.container.innerHTML = '';

        // If there are upcoming parties, create their section
        if (this.upcomingParties.length > 0) {
            this.upcomingPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Upcoming Parties');
            this.upcomingPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            // Loop through each upcoming party and create a party div
            for (let party of this.upcomingParties) {
                const partyDiv = this.createPartyDiv(party, true);
                this.upcomingPartiesContainer.appendChild(partyDiv);
            }
        }

        // If there are past parties, create their section
        if (this.pastParties.length > 0) {
            this.pastPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Past Parties');
            if (this.upcomingParties.length > 0) {
                this.pastPartiesHeader.style.borderTop = '1px solid var(--lighter-grey-color)';
                this.pastPartiesHeader.style.marginTop = '20px';
            }
            this.pastPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            // Loop through each past party and create a party div
            for (let party of this.pastParties) {
                const partyDiv = this.createPartyDiv(party);
                this.pastPartiesContainer.appendChild(partyDiv);
            }
        }
    }

    createPartyDiv(party, upcoming = false) {
        // Create the party div and its elements (image, title, description, etc.)
        const partyDiv = Core.createDiv(this.partyListDiv, `party-${party.id}`, 'party-div');
        const shadow = Core.createDiv(partyDiv, `party-${party.id}-shadow`, 'party-shadow');
        const container = Core.createDiv(partyDiv, `party-${party.id}-container`, 'party-container');

        let image;
        // If the party has a picture, use it; otherwise, use the host's picture
        if (party.pictureBase64) {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.pictureBase64);
        } else {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.host.pictureBase64);
        }
        
        // Create text container for the party details
        const textContainer = Core.createDiv(container, `party-${party.id}-textContainer`, 'party-textContainer');
        const title = Core.createSpan(textContainer, `party-${party.id}-title`, 'party-title', party.title);
        const subtitleContainer = Core.createDiv(textContainer, `party-${party.id}-subtitleContainer`, 'party-subtitleContainer');
        const hostSpan = Core.createSpan(subtitleContainer, `party-${party.id}-host-span`, 'party-host-span');
        const hostByText = Core.createText(hostSpan, 'Hosted by ');
        const host = Core.createAnchor(hostSpan, `party-${party.id}-host-${party.host.id}`, 'party-host', party.host.username);
        host.onclick = this.onClickHost.bind(this);
        const startTime = Core.createSpan(subtitleContainer, `party-${party.id}-startTime`, 'party-startTime', moment(party.startTime).format('MMM D, h:mm A'));
        const address = Core.createSpan(subtitleContainer, `party-${party.id}-address`, 'party-address', party.address.streetAddress);
        const privacy = Core.createSpan(subtitleContainer, `party-${party.id}-privacy`, 'party-privacy', party.privacy);
        const rsvp = Core.createSpan(subtitleContainer, `party-${party.id}-rsvp`, 'party-rsvp', `${party.rsvpCount} / 100 Patrons`);

        const vibesContainer = Core.createDiv(textContainer, `party-${party.id}-vibes`, 'party-vibes');
        
        let vibes = this.capitalize(party.vibes.trim());
        
        // Create a div for each vibe if available
        for (let vibe of vibes) {
            if (vibe.trim().length == 0) { continue; }
            const vibeDiv = Core.createDiv(vibesContainer, `party-${party.id}-vibe-${vibe}`, 'party-vibe', vibe);
            
            // Make the party div clickable if it's an upcoming party
            if (upcoming) {
                vibeDiv.onclick = this.onClickPartyDiv.bind(this); 
            }
        }

        const description = Core.createSpan(textContainer, `party-${party.id}-description`, 'party-description', party.description);
        
        // Make the entire party div clickable if it's upcoming
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

        return partyDiv;
    }

    async onClickPartyDiv(evt) {
        // Handle the click event on the party div, showing RSVP options
        evt.stopPropagation();
        let target = evt.target;
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        // Find the clicked party from the upcoming parties
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

        let userId = parseInt($('userId').value);
        let title = 'RSVP';
        let message = `You're RSVP'ed for ${party.title}. Would you like to cancel?`;

        // Show context menu to confirm RSVP cancellation
        let contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'CANCEL');
        $('context-menu').style.height = '160px';

        const choice = await contextMenu.showSync();

        if (choice) {
            // Cancel the RSVP and show the result
            let cancel = await api.rsvp.cancelRSVP(partyId, userId);

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

            // Reload the upcoming parties list
            this.upcomingParties = await this.getUpcomingParties();
            this.loadParties();
        }
    }

    async onClickHost(evt) {
        // Handle the click event on the host name, showing host details
        evt.stopPropagation();
        evt.preventDefault();

        let target = evt.target;   
        let parts = target.id.split('-');
        let partyId = parseInt(parts[1]);

        let partyDiv = $(`party-${partyId}`);

        let party;
        // Check if the clicked party is an upcoming or past party
        for (let party_ of this.upcomingParties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        for (let party_ of this.pastParties) {
            if (party_.id == partyId) {
                party = party_;
                break;
            }
        }

        if (party == null) {
            return;
        }   

        // Create the context menu to show host details
        const title = 'View Host';

        const hostDiv = Core.createDiv(null, `host-${party.host.id}`, 'host-div');
        const mainContainer = Core.createDiv(hostDiv, `host-${party.host.id}-main-container`, 'host-main-container')
        const image = Core.createImg(mainContainer, `host-${party.host.id}-image`, 'host-image', party.host.pictureBase64);
        const mainInfo = Core.createDiv(mainContainer, `host-${party.host.id}-main-info`, 'host-main-info');
        const username = Core.createSpan(mainInfo, `host-${party.host.id}-username`, 'host-username', party.host.username);

        const vibesContainer = Core.createDiv(mainInfo, `party-${party.id}-vibes`, 'host-vibes');

        // Display host vibes or show a default message
        if (party.host.vibes == null) {
            vibesContainer.innerHTML = 'This host has not entered their vibes.';
        } else {
            let vibes = this.capitalize(party.host.vibes);
            
            for (let vibe of vibes) {
                const vibeDiv = Core.createDiv(vibesContainer, `host-${party.host.id}-vibe-${vibe}`, 'host-vibe', vibe);
            }
        }

        // Display host description or show a default message
        let descriptionInnerHTML = party.host.description != null ? party.host.description : 'This host has not entered a description.';
        const description = Core.createSpan(hostDiv, `host-${party.host.id}-description`, 'host-description', descriptionInnerHTML);

        // Show context menu with host details
        const contextMenu = new ContextMenu(title, '', null, 'OK');
        contextMenu.createElement(hostDiv);
        contextMenu.div.style.height = party.host.description != null ? '415px' : '320px';

        const choice = await contextMenu.showSync();
    }

    async getUpcomingParties() {
        // Fetch the list of upcoming parties
        const parties = await api.rsvp.getUpcomingParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.upcoming);
    }

    async getPastParties() {
        // Fetch the list of past parties
        const parties = await api.rsvp.getPastParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.past);
    }

    parsePartyAPIResult(upcomingParties) {
        // Parse the API response to a usable format
        let parties = [];

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

        return parties;
    }

    capitalize(vibes) {
        // Capitalize the vibes (first letter of each word)
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

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}