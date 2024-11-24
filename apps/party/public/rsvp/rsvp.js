class FeedScreen {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.upcomingPartyListDiv = $('upcomingParties');
        this.pastPartyListDiv = $('pastParties');

        // Placeholder for dynamically loaded parties
        this.parties = await this.getRSVPedParties();

        await this.delay(250);

        this.loadParties(this.parties);
    }

    async getRSVPedParties() {
        let userId = parseInt($('userId').value)
        const result = await api.rsvp.getRSVPedParties(userId);

        if (result) {
            let parties = [];

            for (let party_ of result.parties) {
                let party = {
                    id: party_.id,
                    title: party_.title,
                    startTime: party_.startTime,
                    description: party_.description,
                    vibes: this.capitalize(party_.vibes)
                };

                parties.push(party);
            }

            return parties;
        }
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
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

    async loadParties(parties) {
        this.upcomingPartyListDiv.innerHTML = ""; // Clear list
        this.pastPartyListDiv.innerHTML = ""; // Clear list
        $('pastParties-container').style.display = 'block';


        for (let party of parties) {
            let partyStartTimeUnix = new Date(party.startTime).getTime();
            let now = new Date().getTime();

            let partyDiv;
            if (partyStartTimeUnix < now) {
                partyDiv = Core.createDiv(this.pastPartyListDiv, `party-${party.id}`, 'party-item');
            } else {
                partyDiv = Core.createDiv(this.upcomingPartyListDiv, `party-${party.id}`, 'party-item');
            }

            const title = Core.createElement(partyDiv, 'h3', '', 'party-title', party.title);
            const vibes = Core.createElement(partyDiv, 'p', '', 'party-vibes', party.vibes);
            const startTime = Core.createElement(partyDiv, 'p', '', 'party-startTime', moment(party.startTime).format("MMM Do Y, h:mm A"));
            const description = Core.createElement(partyDiv, 'p', '', 'party-description', party.description);

            if (partyStartTimeUnix > now) {
                partyDiv.onclick = this.onClickPartyDiv.bind(this);
                partyDiv.style.cursor = 'pointer';
            }
        }

        if (this.upcomingPartyListDiv.innerHTML == '') {
            Core.createElement(this.upcomingPartyListDiv, 'p', '', '', "You haven't RSVP'ed for any upcoming parties! head to the <a href='/party/feed' id='upcomingParty-empty-home-anchor'>Home</a> page to find a party!");
        }

        if (this.pastPartyListDiv.innerHTML == '') {
            $('pastParties-container').style.display = 'none';
        }
    }

    async onClickPartyDiv(evt) {
        let target = evt.target;
        let partyDiv;

        if (target.className == 'party-title' || target.className == 'party-vibes' || target.className == 'party-startTime' || target.className == 'party-description') {
            partyDiv = target.parentElement;
        } else {
            partyDiv = target;
        }

        let parts = partyDiv.id.split('-')
        let partyId = parseInt(parts[1]);
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

        await this.delay(250);

        let userId = parseInt($('userId').value);
        let title = 'RSVP';
        let message = `You've already RSVP'ed for ${party.title}. Would you like to cancel?`;

        let contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'CANCEL');
        $('context-menu').style.height = '160px';

        const choice = await contextMenu.showSync();

        if (choice) {
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

            this.parties = await this.getRSVPedParties();
            this.loadParties(this.parties)
        }
    }
}

let feedScreen = new FeedScreen();