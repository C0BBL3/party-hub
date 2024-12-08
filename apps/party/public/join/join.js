// Gives the user an option to join a party they've been invited to
// Author Colby Roberts 

class Join {
    constructor() {
        document.body.onload = this.join.bind(this); // Sets up the method to be run on page load
    }

    // Main join method
    async join() {
        this.userId = parseInt($('userId').value); // Get the user ID from the page
        this.partyId = parseInt($('partyId').value); // Get the party ID from the page

        // If no partyId is provided (the user is trying to join a party that's not available)
        if (!this.partyId) {
            const title = 'OOPS...'; // Error title
            const message = "You can't join this party anymore..."; // Error message

            // Display the error message in a context menu
            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.setHeight('150'); // Set the height for the context menu

            await contextMenu.showSync(); // Show the context menu

            window.location.href = '/'; // Redirect to homepage

            return; // Exit the function as no further actions are needed
        }

        // Fetch the party details and check if the user can join
        const party = await api.join.getParty(this.partyId, this.userId);

        // If the party is full
        if (!party.result) {
            const title = 'OOPS...'; // Error title
            const message = "It looks like this party is full at the moment!"; // Error message

            // Display the error message in a context menu
            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.setHeight('150'); // Set the height for the context menu

            return await contextMenu.showSync(); // Show the context menu and exit if the party is full
        } else {
            // If the party is not full, ask the user to RSVP
            let title = 'RSVP'; // Prompt title
            let message = `Would you like to RSVP for ${party.title}?`; // Prompt message with the party title

            // Show the context menu with options to RSVP or cancel
            let contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'PARTY TIME!');
            $('context-menu').style.height = '150px'; // Set context menu height

            const choice = await contextMenu.showSync(); // Show the context menu and wait for user input

            // If the user chooses to RSVP
            if (choice) {
                // Send RSVP request to the API
                let rsvp = await api.join.RSVP(this.partyId, this.userId);

                await this.delay(500); // Wait briefly for the RSVP request to complete

                title = rsvp.result ? 'RSVP' : 'OOPS...'; // Set title based on RSVP success or failure

                // If RSVP is successful
                if (rsvp.result) {
                    message = `You have reserved a spot at ${party.party.title}.`; // Success message
                } else {
                    message = `There seems to be an error, please try again later...`; // Error message if RSVP fails
                }

                contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = rsvp.result ? '150px' : '160px'; // Adjust context menu height

                await contextMenu.showSync(); // Show the confirmation message
            }
        }

        window.location.href = '/'; // Redirect to homepage after the RSVP action
    }

    // Utility method to create a delay
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null); // Resolve the promise after the specified delay
            }, timeMS);
        });
    }
}

// Create an instance of the Join class to initialize the process
const join = new Join();