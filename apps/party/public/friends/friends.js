class Friends {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    init() {
        this.friendsContainer = $('friendsContainer');
        this.requestsContainer = $('requestsContainer');

        this.searchBar = $('friendsearch');
        this.searchBar.onkeyup = this.onKeyUpSearchBar.bind(this);
        this.searchBarTimeout = null;

        this.userId = document.getElementById("userId").value

        const request_acceptButtons = document.getElementsByClassName("request-acceptButton");
        for (let acceptButton of request_acceptButtons) {
            let buttonId = acceptButton.innerHTML;
            let id = Number(buttonId.split("-")[1]);
            document.getElementById(buttonId).onmousedown = this.onAccept.bind(this, id);
        }

        const request_declineButtons = document.getElementsByClassName("request-declineButton");
        for (let declineButton of request_declineButtons) {
            let buttonId = declineButton.innerHTML;
            let id = Number(buttonId.split("-")[1]);
            document.getElementById(buttonId).onmousedown = this.onDecline.bind(this, id);
        }
    }

    onAccept(friendId) {
        api.friends.accept(this.userId, friendId);
        /*let reqContents = this.requestsContainer.innerHTML;
        let friendContents = this.friendsContainer.innerHTML;
        this.requestsContainer.innerHTML = reqContents;
        this.friendsContainer.innerHTML = friendContents;*/
        //document.location.reload()
    }

    onDecline(friendId) {
        api.friends.reject(this.userId, friendId);
        //document.location.reload()
    }

    onKeyUpSearchBar() {
        this.createLoadingGIFDiv(this.friendsContainer);

        clearTimeout(this.searchBarTimeout);
        this.searchBarTimeout = setTimeout(this._onKeyUpSearchBar.bind(this), 250);
    }

    async _onKeyUpSearchBar() {
        let query = this.searchBar.value.trim();
        let search = await api.friends.search(query);

        this.removeLoadingGIFDiv();

        if (search.result) {
            if (search.friends.length == 0) {
                this.friendsContainer.innerHTML = 'Oops... it appears no one goes by that name!';
            } else {
                for (let friend of search.friends) {
                    let friendP = Core.createElement(this.friendsContainer, 'p', `friend-${friend.userId}`);
                    let friendButton = Core.createElement(friendP, 'button', `friend-${friend.userId}-messageButton`, 'button message');
                }
            }
        } else {
            this.friendsContainer.innerHTML = 'Oops... there appears to be an error with this query, please try again later!';
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
}

let friends = new Friends();