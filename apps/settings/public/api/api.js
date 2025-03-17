class API {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {
        this.userId = parseInt($('userId').value);

        this.publicKeyInput = $('publicKey');
        this.secretKeyInput = $('secretKey');

        this.revealButton = $('revealButton');
        this.revealButton.onclick = this.onClickRevealButton.bind(this);
    }

    async onClickRevealButton(evt) {
        let title = 'REVEAL';
        let message = 'Do you wish to reveal your API Keys? Every time we reveal them to you they will be regenerated and the old API keys will be invalidated.';
        let contextMenu = new ContextMenu(title, message);
        $('context-menu').style.height = '200px';
        let result = await contextMenu.showSync(); // Show success context menu
        
        if (result) {
            const response = await api.customer.create(this.userId);

            await this.delay(250);

            if (!response.result) { return; }

            const apiPublicKey = response.apiPublicKey;
            const apiSecretKey = response.apiSecretKey;

            this.publicKeyInput.value = apiPublicKey;
            this.secretKeyInput.value = apiSecretKey;

            title = 'REVEALED';
            message = 'Keys Revealed.';
            contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '150px';
            return await contextMenu.showSync(); // Show success context menu
        }        
    }

    // Helper function for delay
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null); // Resolve after delay
            }, timeMS);
        });
    }
}

let profile = new API();