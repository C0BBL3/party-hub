class List {
    constructor() {
        document.body.onload = this.init.bind(this)
    }

    async init() {
        this.userId = parseInt($('userId').value);
        this.container = $('container');

        this.upcomingParties = await this.getUpcomingParties();
        this.pastParties = await this.getPastParties();

        await this.delay(250);

        this.loadParties();
    }

    loadParties() {
        if (this.upcomingParties.length > 0) {
            this.upcomingPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Upcoming Parties');
            this.upcomingPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            for (let party of this.upcomingParties) {
                const partyDiv = this.createPartyDiv(party, true);
                this.upcomingPartiesContainer.appendChild(partyDiv);
            }
        }

        if (this.pastParties.length > 0) {
            this.pastPartiesHeader = Core.createDiv(this.container, '', 'parties-header', 'Past Parties');
            if (this.upcomingParties.length > 0) {
                this.pastPartiesHeader.style.borderTop = '1px solid var(--lighter-grey-color)';
            }
            this.pastPartiesContainer = Core.createDiv(this.container, '', 'parties-container');

            for (let party of this.pastParties) {
                const partyDiv = this.createPartyDiv(party);
                this.pastPartiesContainer.appendChild(partyDiv);
            }
        }
    }

    createPartyDiv(party, upcoming = false) {
        const partyDiv = Core.createDiv(this.partyListDiv, `party-${party.id}`, 'party-div');
            
        partyDiv.onmouseenter = this.onMouseEnterPartyDiv.bind(this);
        partyDiv.onmouseleave = this.onMouseExitPartyDiv.bind(this);

        const shadow = Core.createDiv(partyDiv, `party-${party.id}-shadow`, 'party-shadow');
        const container = Core.createDiv(partyDiv, `party-${party.id}-container`, 'party-container');

        let image;
        if (party.pictureBase64) {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.pictureBase64);
        } else {
            image = Core.createImg(container, `party-${party.id}-image`, 'party-image', party.host.pictureBase64);
        }
        
        const textContainer = Core.createDiv(container, `party-${party.id}-textContainer`, 'party-textContainer');
        const title = Core.createSpan(textContainer, `party-${party.id}-title`, 'party-title', party.title);
        const subtitleContainer = Core.createDiv(textContainer, `party-${party.id}-subtitleContainer`, 'party-subtitleContainer');
        const startTime = Core.createSpan(subtitleContainer, `party-${party.id}-startTime`, 'party-startTime', moment(party.startTime).format('MMM D, h:mm A'));
        const address = Core.createSpan(subtitleContainer, `party-${party.id}-address`, 'party-address', party.address.streetAddress);
        const rsvp = Core.createSpan(subtitleContainer, `party-${party.id}-rsvp`, 'party-rsvp', `${party.rsvpCount} / 100 Patrons`);

        const vibesContainer = Core.createDiv(textContainer, `party-${party.id}-vibes`, 'party-vibes');
        
        let vibes = this.capitalize(party.vibes.trim());
        
        for (let vibe of vibes) {
            if (vibe.trim().length == 0) { continue; }
            const vibeDiv = Core.createDiv(vibesContainer, `party-${party.id}-vibe-${vibe}`, 'party-vibe', vibe);
            
            if (upcoming) {
                vibeSpan.onclick = this.onClickPartyDiv.bind(this); 
            }
        }

        const description = Core.createSpan(textContainer, `party-${party.id}-description`, 'party-description', party.description);
        
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
            rsvp.onclick = this.onClickPartyDiv.bind(this); 
            vibesContainer.onclick = this.onClickPartyDiv.bind(this); 
            description.onclick = this.onClickPartyDiv.bind(this); 
        }

        return partyDiv;
    }

    async onClickPartyDiv() {
        evt.stopPropagation()
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

        const title = 'Edit';
        const message = `Do you wish to edit ${party.title}?`
        const contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'YES');
        contextMenu.div.style.height = '150px';

        const choice = await contextMenu.showSync();

        if (choice) {
            window.location.href = `/host/edit?id=${party.id}`;
        }
    }

    onMouseEnterPartyDiv(evt) {
        let id = evt.target.id;
        let parts = id.split('-');
        let shadow = $(`party-${parts[1]}-shadow`);

        shadow.style.background = 'linear-gradient(to bottom right, var(--blue-color), var(--pink-color)) !important';
        shadow.style.opacity = 1;
    }

    onMouseExitPartyDiv(evt) {
        let id = evt.target.id;
        let parts = id.split('-');
        let shadow = $(`party-${parts[1]}-shadow`);

        shadow.style.background = 'black';
        shadow.style.opacity = 0.1;
    }

    async getUpcomingParties() {
        const parties = await api.list.getUpcomingParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.upcoming);
    }

    async getPastParties() {
        const parties = await api.list.getPastParties(this.userId);
        if (!parties.result) { return []; }
        return this.parsePartyAPIResult(parties.past);
    }

    parsePartyAPIResult(upcomingParties) {
        let parties = [];

        for (let party_ of upcomingParties) {
            let party = {
                id: party_.id,
                title: party_.title,
                startTime: party_.startTime,
                description: party_.description,
                vibes: this.capitalize(party_.vibes).join(','),
                pictureBase64: party_.pictureBase64,
                host: party_.host,
                rsvpCount: party_.rsvpCount,
                address: party_.address
            };

            parties.push(party);
        }

        return parties;
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

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

const list = new List();