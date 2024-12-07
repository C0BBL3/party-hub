// Gives the user an option to join a party they've been invited to
// Author Colby Roberts 

class Join {
    constructor() {
        document.body.onload = this.join.bind(this);
    }

    async join() {
        this.userId = parseInt($('userId').value);
        this.partyId = parseInt($('partyId').value);

        if (!this.partyId) {
            const title = 'OOPS...';
            const message = "You can't join this party anymore...";

            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.setHeight('150');

            await contextMenu.showSync();

            window.location.href = '/';

            return;
        }

        const party = await api.join.getParty(this.partyId, this.userId);

        if (!party.result) {
            const title = 'OOPS...';
            const message = "It looks like this party is full at the moment!";

            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.setHeight('150');

            return await contextMenu.showSync();
        } else {
            let title = 'RSVP';
            let message = `Would you like to RSVP for ${party.title}?`;

            let contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'PARTY TIME!');
            $('context-menu').style.height = '150px';

            const choice = await contextMenu.showSync();

            if (choice) {
                let rsvp = await api.join.RSVP(this.partyId, this.userId);

                await this.delay(500);

                title = rsvp.result ? 'RSVP' : 'OOPS...';

                if (rsvp.result) {
                    message = `You have reserved a spot at ${party.party.title}.`;
                } else {
                    message = `There seems to be an error please try again at another time...`;
                }

                contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = rsvp.result ? '150px' : '160px';

                await contextMenu.showSync();
            }
        }

        window.location.href = '/';
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

const join = new Join()