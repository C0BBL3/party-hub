class Profile {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
        this.userId = parseInt($('userId').value);

        this.profileImage = $('profileImage');

        this.profileImageUpload = $('profileImageUpload');
        this.profileImageUpload.onchange = this.previewImage.bind(this);

        this.firstNameInput = $('firstName');
        this.lastNameInput = $('lastName');

        this.descriptionInput = $('description');

        this.vibesInput = $('vibes');

        this.nameDisplay = $('nameDisplay');
        this.splitNameContainer = $('splitNameContainer');

        this.editNameButton = $('editNameButton');
        this.editNameButton.onclick = this.onClickEditNameButton.bind(this);

        this.editDescriptionButton = $('editDescriptionButton');
        this.editDescriptionButton.onclick = this.onClickEditDescriptionButton.bind(this);
        
        this.editVibesButton = $('editVibesButton');
        this.editVibesButton.onclick = this.onClickEditVibesButton.bind(this);

        this.doneNameButton = $('doneNameButton');
        this.doneNameButton.onclick = this.onClickDoneNameButton.bind(this);

        this.doneDescriptionButton = $('doneDescriptionButton');
        this.doneDescriptionButton.onclick = this.onClickDoneDescriptionButton.bind(this);

        this.doneVibesButton = $('doneVibesButton');
        this.doneVibesButton.onclick = this.onClickDoneVibesButton.bind(this);

        this.saveButton = $('saveButton');
        this.saveButton.onclick = this.onClickSaveButton.bind(this);
    }

    onClickEditNameButton(evt) {
        this.splitNameContainer.style.display = 'flex';
        this.nameDisplay.style.display = 'none';
        this.editNameButton.style.display = 'none';
        this.doneNameButton.style.display = 'block';
    }

    onClickDoneNameButton(evt) {
        this.splitNameContainer.style.display = 'none';
        this.nameDisplay.style.display = 'block';
        this.editNameButton.style.display = 'block';
        this.doneNameButton.style.display = 'none';
        this.nameDisplay.value = `${this.firstNameInput.value.trim()} ${this.lastNameInput.value.trim()}`.trim();
    }

    onClickEditDescriptionButton(evt) {
        this.descriptionInput.removeAttribute('readonly');
        this.descriptionInput.focus();
        this.editDescriptionButton.style.display = 'none';
        this.doneDescriptionButton.style.display = 'block';
    }

    onClickDoneDescriptionButton(evt) {
        this.descriptionInput.setAttribute('readonly', true);
        this.editDescriptionButton.style.display = 'block';
        this.doneDescriptionButton.style.display = 'none';
    }

    onClickEditVibesButton(evt) {
        this.vibesInput.removeAttribute('readonly');
        this.vibesInput.focus();
        this.editVibesButton.style.display = 'none';
        this.doneVibesButton.style.display = 'block';
    }

    onClickDoneVibesButton(evt) {
        this.vibesInput.setAttribute('readonly', true);
        this.editVibesButton.style.display = 'block';
        this.doneVibesButton.style.display = 'none';
    }

    async encodeImageToBase64(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl;
    
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
    
                try {
                    const base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (error) {
                    reject(error);
                }
            };
    
            img.onerror = (error) => {
                reject(error);
            };
        });
    }

    async previewImage(event) {
        const file = event.target.files[0];

        if (file.size > 196608) {
            let title = 'OOPS...';
            let message = "Profile picture size must be smaller that 256x256!";
    
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '150px';
    
            return await contextMenu.showSync();
        }

        const imageUrl = URL.createObjectURL(file);
        const base64ImageUrl = await this.encodeImageToBase64(imageUrl);
        
        const update = await api.profile.updateProfilePicture(this.userId, base64ImageUrl);
    
        if (!update.result) {
            let title = 'OOPS...';
            let message = 'There seemed to be an issue updating your profile picture... please try again at another time.';
    
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '165px';
    
            return await contextMenu.showSync();
        }
    
        this.profileImage.src = base64ImageUrl;
    }

    async onClickSaveButton(evt) {
        $('container').style.cursor = 'progress';

        if (this.nameDisplay.placeholder != this.nameDisplay.value) { // name was changed
            const response = await api.profile.updateName(this.userId, this.firstNameInput.value.trim(), this.lastNameInput.value.trim());

            if (!response || !response.result) {
                await this.delay(750);

                $('container').style.cursor = 'auto';

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your name... please try again at another time.';

                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';

                return await contextMenu.showSync();
            }
        }

        if (this.descriptionInput.placeholder != this.descriptionInput.value) { // description was changed
            const response = await api.profile.updateDescription(this.userId, this.descriptionInput.value.trim());

            if (!response || !response.result) {
                await this.delay(750);
                
                $('container').style.cursor = 'auto';

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your description... please try again at another time.';

                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';

                return await contextMenu.showSync();
            }
        }

        if (this.vibesInput.placeholder != this.vibesInput.value) { // vibes were changed
            const response = await api.profile.updateVibes(this.userId, this.vibesInput.value.trim());

            if (!response || !response.result) {
                await this.delay(750);
                
                $('container').style.cursor = 'auto';

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your vibes... please try again at another time.';

                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';

                return await contextMenu.showSync();
            }
        }

        await this.delay(750);
                
        $('container').style.cursor = 'auto';

        let title = 'SAVED';
        let message = 'Profile updated.';

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '150px';

        return await contextMenu.showSync();
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

let profile = new Profile();