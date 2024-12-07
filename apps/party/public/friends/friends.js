/*
Dynamically manages the Feed screen and its behaviors
Author Makani Buckley, Colby Roberts
*/
class Friends {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.userId = parseInt($("userId").value);

        this.friendsContainer = $('friends');
        this.friendsTab = $('friends-tab');
        this.friendsTab.onclick = this.onClickFriendsTab.bind(this);

        this.requestsContainer = $('requests');
        this.requestsTab = $('requests-tab');
        this.requestsTab.onclick = this.onClickRequestsTab.bind(this);

        this.searchContainer = $('search');
        this.searchTab = $('search-tab');
        this.searchTab.onclick = this.onClickSearchTab.bind(this);
        
        this.searchBar = $('search-bar');
        this.searchBar.onkeyup = this.onKeyUpSearchBar.bind(this);
        this.searchBarTimeout = null;

        this.searchResults = $('search-results');

        await this.loadFriends();
        this.loadRequests();
    }

    async loadFriends() {
        this.createLoadingGIFDiv(this.friendsContainer);

        const friends = await api.friends.friends(this.userId);

        await this.delay(250);

        this.removeLoadingGIFDiv();

        if (friends.result) {
            this.friends = friends.friends;
            
            for (let friend of this.friends) {
                this.createFriendDiv(friend);
            }
        }
    }

    createFriendDiv(friend) {
        const friendDiv = Core.createDiv(this.friendsContainer, `friend-${friend.id}`, 'friend');
        const pictureBase64 = Core.createImg(friendDiv, `friend-${friend.id}-pictureBase64`, '', friend.pictureBase64);

        const infoContainer = Core.createDiv(friendDiv, `friend-${friend.id}-info-container`, 'friend-info-container');

        const username = Core.createSpan(infoContainer, `friend-${friend.id}-info-username`, 'friend-info-username', friend.username);
        username.onclick = this.onClickFriend.bind(this, friend);

        const status = Core.createSpan(infoContainer, `friend-${friend.id}-info-status`, 'friend-info-status', friend.status > 1 ? 'Friend' : 'Following');
        status.onclick = this.onClickFriendStatus.bind(this, friend);


        const optionsContainer = Core.createDiv(friendDiv, `friend-${friend.id}-options-container`, 'friend-options-container', `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <rect y="11" width="24" height="2" rx="1"></rect>
                <rect y="4" width="24" height="2" rx="1"></rect>
                <rect y="18" width="24" height="2" rx="1"></rect>
            </svg>`
        );
        optionsContainer.onclick = this.onClickFriendMenuBurger.bind(this, friend);

        return friendDiv;
    }

    async onClickFriend(friend, evt) {
        const title = friend.username;

        const friendCCDiv = Core.createDiv(null, `friendCC-${friend.id}`, 'friendCC-div');
        const mainContainer = Core.createDiv(friendCCDiv, `friendCC-${friend.id}-main-container`, 'friendCC-main-container')
        const image = Core.createImg(mainContainer, `friendCC-${friend.id}-image`, 'friendCC-image', friend.pictureBase64);
        const mainInfo = Core.createDiv(mainContainer, `friendCC-${friend.id}-main-info`, 'friendCC-main-info');
        const usernameContainer = Core.createDiv(mainInfo, `friendCC-${friend.id}-username-container`, 'friendCC-username');
        const username = Core.createSpan(usernameContainer, `friendCC-${friend.id}-username`, 'friendCC-username', friend.username);
        const status = Core.createDiv(usernameContainer, `friendCC-${friend.id}-status`, 'friendCC-status', friend.isHost ? 'Host' : 'Patron' );        

        const vibesContainer = Core.createDiv(mainInfo, `friendCC-${friend.id}-vibes`, 'friendCC-vibes');

        if (friend.vibes == null) {
            vibesContainer.innerHTML = `${friend.status > 1 ? 'Your friend' : 'This user'} has not entered the vibes they give off.`
        } else {
            let vibes = this.capitalize(friend.vibes);
            
            for (let vibe of vibes) {
                const vibeDiv = Core.createDiv(vibesContainer, `friendCC-${friend.id}-vibe-${vibe}`, 'friendCC-vibe', vibe);
            }
        }

        let descriptionInnerHTML = friend.description != null ? friend.description : `${friend.status > 1 ? 'Your friend' : 'This user'} has not entered a description.`
        const description = Core.createSpan(friendCCDiv, `friendCC-${friend.id}-description`, 'friendCC-description', descriptionInnerHTML);

        const contextMenu = new ContextMenu(title, '', null, 'OK');
        contextMenu.createElement(friendCCDiv);
        contextMenu.setHeight(friend.description != null ? '415' : '320');

        await contextMenu.showSync();
    }


    async onClickFriendStatus(friend, evt) {
        let title = friend.username;
        let message;
        if (friend.status > 1) {
            message = `You are friends with ${friend.username}!`;
        } else {
            if (friend.isHost) {
                message = `You currently follow ${friend.username}`;
            } else {
                message = `You have sent a friend request to ${friend.username}, in the mean time, you are following them and can see what parties they're attending!`;
            }
        }

        const contextMenu = new ContextMenu(title, message, null, 'OK');

        if (!friend.isHost && friend.status == 1) {
            contextMenu.setHeight('185');
        } else {
            contextMenu.setHeight('145');
        }

        await contextMenu.showSync();
    }

    async onClickFriendMenuBurger(friend, evt) {
        let title, message;
        if (friend.status > 1) {
            title = `Unfriend ${friend.username}`;
            message = `Do you wish to unfriend ${friend.username}?`;
        } else {
            title = `Unfollow ${friend.username}`;
            message = `Do you wish to unfollow ${friend.username}?`;
        }

        const contextMenu = new ContextMenu(title, message, 'NEVERMIND', friend.status > 1 ? 'UNFRIEND' : 'UNFOLLOW');
        contextMenu.setHeight('145');

        const choice = await contextMenu.showSync();

        if (choice) {
            await api.friends.removeFriend(this.userId, friend.id);

            await this.delay(250);

            let title, message;
            if (friend.status > 1) {
                title = `Unfriended ${friend.username}`;
                message = `You have unfriended ${friend.username}.`;
            } else {
                title = `Unfollowed ${friend.username}`;
                message = `You have unfollowed ${friend.username}.`;
            }

            const contextMenu = new ContextMenu(title, message, null, 'OK');
            contextMenu.setHeight('145');

            this.loadFriends();

            await contextMenu.showSync();
        }
    }

    async loadRequests() {
        this.createLoadingGIFDiv(this.requestsContainer);

        const requests = await api.friends.requests(this.userId);

        await this.delay(250);

        this.removeLoadingGIFDiv();

        if (requests.result) {
            this.request = requests.requests;
            
            for (let request of this.request) {
                this.createRequestDiv(request);
            }
        }
    }

    createRequestDiv(request) {
        const requestDiv = Core.createDiv(this.requestsContainer, `request-${request.id}`, 'request');
        const pictureBase64 = Core.createImg(requestDiv, `request-${request.id}-pictureBase64`, '', request.pictureBase64);

        const infoContainer = Core.createDiv(requestDiv, `request-${request.id}-info-container`, 'request-info-container');

        const username = Core.createSpan(infoContainer, `request-${request.id}-info-username`, 'request-info-username', request.username);
        username.onclick = this.onClickFriend.bind(this, request);

        const optionsContainer = Core.createDiv(requestDiv, `request-${request.id}-options-container`, 'request-options-container');

        const reject = Core.createDiv(optionsContainer, `request-${request.id}-reject`, 'cross', `
            <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" height="30" width="30">
                <path d="M23.707.293h0a1,1,0,0,0-1.414,0L12,10.586,1.707.293a1,1,0,0,0-1.414,0h0a1,1,0,0,0,0,1.414L10.586,12,.293,22.293a1,1,0,0,0,0,1.414h0a1,1,0,0,0,1.414,0L12,13.414,22.293,23.707a1,1,0,0,0,1.414,0h0a1,1,0,0,0,0-1.414L13.414,12,23.707,1.707A1,1,0,0,0,23.707.293Z"/>
            </svg>`
        );
        reject.onclick = this.onReject.bind(this, request.id);

        const accept = Core.createDiv(optionsContainer, `request-${request.id}-accept`, 'check', `
            <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" height="40" width="40">
                <path d="M22.319,4.431,8.5,18.249a1,1,0,0,1-1.417,0L1.739,12.9a1,1,0,0,0-1.417,0h0a1,1,0,0,0,0,1.417l5.346,5.345a3.008,3.008,0,0,0,4.25,0L23.736,5.847a1,1,0,0,0,0-1.416h0A1,1,0,0,0,22.319,4.431Z"/>
            </svg>`
        );
        accept.onclick = this.onAccept.bind(this, request.id);

        
        return requestDiv;
    }

    async onAccept(friendId) {
        await api.friends.accept(this.userId, friendId);
        await this.loadRequests();
    }

    async onReject(friendId) {
        await api.friends.reject(this.userId, friendId);
        await this.loadRequests();
    }

    hideAll() {
        this.friendsContainer.style.display = 'none';
        this.requestsContainer.style.display = 'none';
        this.searchContainer.style.display = 'none';

        this.friendsTab.classList.remove('selected');
        this.requestsTab.classList.remove('selected');
        this.searchTab.classList.remove('selected');
    }

    onClickFriendsTab(evt) {
        this.hideAll();
        this.friendsContainer.style.display = 'flex';
        this.friendsTab.classList.add('selected');

        this.loadFriends();
    }

    onClickRequestsTab(evt) {
        this.hideAll();
        this.requestsContainer.style.display = 'flex';
        this.requestsTab.classList.add('selected');

        this.loadRequests();
    }

    onClickSearchTab(evt) {
        this.hideAll();
        this.searchContainer.style.display = 'block';
        this.searchTab.classList.add('selected');
    }

    async onRequest(friendId) {
        await api.friends.request(this.userId, friendId);
    }

    onKeyUpSearchBar() {
        this.createLoadingGIFDiv(this.searchResults);

        clearTimeout(this.searchBarTimeout);
        this.searchBarTimeout = setTimeout(this._onKeyUpSearchBar.bind(this), 250);
    }

    async _onKeyUpSearchBar() {
        let query = this.searchBar.value.trim();
        let search = await api.friends.search(query);

        this.removeLoadingGIFDiv();

        if (search.result) {
            if (search.patrons.length == 0) {
                this.searchResults.innerHTML = '';
                Core.createDiv(this.searchResults, 'no-results', '', 'Oops... it appears no one goes by that name!')
            } else {
                for (let friend of search.patrons) {
                    this.createPatronDiv(friend);
                }
            }
        } else if (query == '') {
            this.searchResults.innerHTML = '';
            Core.createDiv(this.searchResults,'no-results', '', 'Type into the search bar to search for your friends!');
        } else {
            this.searchResults.innerHTML = '';
            Core.createDiv(this.searchResults, 'no-results', '', 'Oops... there appears to be an error with this query, please try again later!');
        }
    }

    createPatronDiv(patron) {
        const requestDiv = Core.createDiv(this.searchResults, `patron-${patron.id}`, 'patron');
        const pictureBase64 = Core.createImg(requestDiv, `patron-${patron.id}-pictureBase64`, '', patron.pictureBase64);

        const infoContainer = Core.createDiv(requestDiv, `patron-${patron.id}-info-container`, 'patron-info-container');

        const username = Core.createSpan(infoContainer, `patron-${patron.id}-info-username`, 'patron-info-username', patron.username);
        username.onclick = this.onClickFriend.bind(this, patron);

        const optionsContainer = Core.createDiv(requestDiv, `patron-${patron.id}-options-container`, 'patron-options-container');

        const add = Core.createDiv(optionsContainer, `patron-${patron.id}-add`, 'add', `
            <svg height="40" viewBox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z"/>
            </svg>`
        );
        add.onclick = this.onAddFriend.bind(this, patron);

        
        return requestDiv;
    }

    async onAddFriend(patrons, evt) {
        const title = 'Add Friend';
        const message = `Do you wish to add ${patrons.username} as a friend?`;

        const contextMenu = new ContextMenu(title, message, 'NEVERMIND', 'YES');
        contextMenu.setHeight('145');

        const choice = await contextMenu.showSync();

        if (choice) {
            const request = await api.friends.request(this.userId, patrons.id);

            await this.delay(250);

            if (request.pending) {
                const title = 'Add Friend';
                const message = `You've already requsted to be ${patrons.username}'s friend!`;

                const contextMenu = new ContextMenu(title, message, null, 'OK');
                contextMenu.setHeight('155');

                return await contextMenu.showSync();
            }

            if (request.result) {
                const title = 'Add Friend';
                const message = `You have successfully requsted to be ${patrons.username}'s friend!`;

                const contextMenu = new ContextMenu(title, message, null, 'OK');
                contextMenu.setHeight('155');

                this.loadFriends();
                this.loadRequests();

                await contextMenu.showSync();
            } else {
                const title = 'OOPS';
                const message = `Oops... there was an error requsting to be ${patrons.username}'s friend...`;

                const contextMenu = new ContextMenu(title, message, null, 'OK');
                contextMenu.setHeight('155');

                await contextMenu.showSync();
            }
        }
    }

    // <div class="loading-GIF-outer">
    //     <div class="loading-GIF-inner">
    //         <div></div>
    //     </div>
    // </div> 

    createLoadingGIFDiv(parentDiv) {
        if (!this.loadingGIFDiv) {
            parentDiv.innerHTML = '';
            this.loadingGIFDiv = Core.createDiv(parentDiv, '', 'loading-GIF-outer');
            let innerDiv = Core.createDiv(this.loadingGIFDiv, '', 'loading-GIF-inner');
            let spinnyDiv = Core.createDiv(innerDiv);
        }
    }

    removeLoadingGIFDiv() {
        this.loadingGIFDiv.innerHTML = '';
        Core.removeElement(this.loadingGIFDiv);
        this.loadingGIFDiv = null;
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

let friends = new Friends();