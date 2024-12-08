/*
Dynamically manages the Profile screen and its behaviors
Author Colby Roberts
*/
class Profile {
    constructor() {
        // Initializes the class, binds functions, and loads necessary event listeners
        document.body.onload = this.init.bind(this);      
    }
    
    init() {
        // Grabs the userId from a hidden field
        this.userId = parseInt($('userId').value);

        // Profile image related elements
        this.profileImage = $('profileImage');
        this.profileImageUpload = $('profileImageUpload');
        this.profileImageUpload.onchange = this.previewImage.bind(this); // Previews image on upload

        // Other input elements for profile editing
        this.firstNameInput = $('firstName');
        this.lastNameInput = $('lastName');
        this.descriptionInput = $('description');
        this.vibesInput = $('vibes');

        // Display elements for user profile
        this.nameDisplay = $('nameDisplay');
        this.splitNameContainer = $('splitNameContainer');

        // Buttons for editing profile fields
        this.editNameButton = $('editNameButton');
        this.editNameButton.onclick = this.onClickEditNameButton.bind(this); // Edit name
        this.editDescriptionButton = $('editDescriptionButton');
        this.editDescriptionButton.onclick = this.onClickEditDescriptionButton.bind(this); // Edit description
        this.editVibesButton = $('editVibesButton');
        this.editVibesButton.onclick = this.onClickEditVibesButton.bind(this); // Edit vibes

        // Buttons for saving profile changes
        this.doneNameButton = $('doneNameButton');
        this.doneNameButton.onclick = this.onClickDoneNameButton.bind(this); // Save name changes
        this.doneDescriptionButton = $('doneDescriptionButton');
        this.doneDescriptionButton.onclick = this.onClickDoneDescriptionButton.bind(this); // Save description changes
        this.doneVibesButton = $('doneVibesButton');
        this.doneVibesButton.onclick = this.onClickDoneVibesButton.bind(this); // Save vibes changes

        this.saveButton = $('saveButton');
        this.saveButton.onclick = this.onClickSaveButton.bind(this); // Save all changes
    }

    // Handle editing name
    onClickEditNameButton(evt) {
        this.splitNameContainer.style.display = 'flex'; // Show name inputs
        this.nameDisplay.style.display = 'none'; // Hide name display
        this.editNameButton.style.display = 'none'; // Hide edit button
        this.doneNameButton.style.display = 'block'; // Show done button
    }

    // Handle saving name changes
    onClickDoneNameButton(evt) {
        this.splitNameContainer.style.display = 'none'; // Hide name inputs
        this.nameDisplay.style.display = 'block'; // Show name display
        this.editNameButton.style.display = 'block'; // Show edit button
        this.doneNameButton.style.display = 'none'; // Hide done button
        // Set name display with the new values
        this.nameDisplay.value = `${this.firstNameInput.value.trim()} ${this.lastNameInput.value.trim()}`.trim();
    }

    // Handle editing description
    onClickEditDescriptionButton(evt) {
        this.descriptionInput.removeAttribute('readonly'); // Enable editing
        this.descriptionInput.focus(); // Focus on input
        this.editDescriptionButton.style.display = 'none'; // Hide edit button
        this.doneDescriptionButton.style.display = 'block'; // Show done button
    }

    // Handle saving description changes
    onClickDoneDescriptionButton(evt) {
        this.descriptionInput.setAttribute('readonly', true); // Disable editing
        this.editDescriptionButton.style.display = 'block'; // Show edit button
        this.doneDescriptionButton.style.display = 'none'; // Hide done button
    }

    // Handle editing vibes
    onClickEditVibesButton(evt) {
        this.vibesInput.removeAttribute('readonly'); // Enable editing
        this.vibesInput.focus(); // Focus on input
        this.editVibesButton.style.display = 'none'; // Hide edit button
        this.doneVibesButton.style.display = 'block'; // Show done button
    }

    // Handle saving vibes changes
    onClickDoneVibesButton(evt) {
        this.vibesInput.setAttribute('readonly', true); // Disable editing
        this.editVibesButton.style.display = 'block'; // Show edit button
        this.doneVibesButton.style.display = 'none'; // Hide done button
    }

    // Encode image URL to Base64 format
    async encodeImageToBase64(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Allow cross-origin image loading
            img.src = imageUrl; // Set image source
    
            img.onload = () => {
                // Create canvas to draw the image and convert to Base64
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
    
                try {
                    const base64 = canvas.toDataURL('image/png'); // Convert to Base64
                    resolve(base64); // Resolve the promise with Base64 string
                } catch (error) {
                    reject(error); // Reject on error
                }
            };
    
            img.onerror = (error) => {
                reject(error); // Reject on error
            };
        });
    }

    // Preview and validate the uploaded image
    async previewImage(event) {
        const file = event.target.files[0]; // Get the selected file

        if (file.size > 196608) { // Check if file size is larger than 200KB
            let title = 'OOPS...';
            let message = "Profile picture size must be smaller than 200 kilobytes!";
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '150px'; // Set context menu height
            return await contextMenu.showSync(); // Show error context menu
        }

        // Create URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        // Convert image to Base64 format
        const base64ImageUrl = await this.encodeImageToBase64(imageUrl);
        
        // Update profile picture via API
        const update = await api.profile.updateProfilePicture(this.userId, base64ImageUrl);
    
        if (!update.result) {
            let title = 'OOPS...';
            let message = 'There seemed to be an issue updating your profile picture... please try again at another time.';
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '165px'; // Set context menu height
            return await contextMenu.showSync(); // Show error context menu
        }
    
        // Update profile image display with the new image
        this.profileImage.src = base64ImageUrl;
    }

    // Save changes made to the profile
    async onClickSaveButton(evt) {
        $('container').style.cursor = 'progress'; // Show loading cursor

        // Check if the name has been changed
        if (this.nameDisplay.placeholder != this.nameDisplay.value) {
            const response = await api.profile.updateName(this.userId, this.firstNameInput.value.trim(), this.lastNameInput.value.trim());

            if (!response || !response.result) { // If update failed
                await this.delay(750);
                $('container').style.cursor = 'auto'; // Reset cursor

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your name... please try again at another time.';
                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';
                return await contextMenu.showSync(); // Show error context menu
            }
        }

        // Check if the description has been changed
        if (this.descriptionInput.placeholder != this.descriptionInput.value) {
            const response = await api.profile.updateDescription(this.userId, this.descriptionInput.value.trim());

            if (!response || !response.result) { // If update failed
                await this.delay(750);
                $('container').style.cursor = 'auto'; // Reset cursor

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your description... please try again at another time.';
                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';
                return await contextMenu.showSync(); // Show error context menu
            }
        }

        // Check if the vibes have been changed
        if (this.vibesInput.placeholder != this.vibesInput.value) {
            const response = await api.profile.updateVibes(this.userId, this.vibesInput.value.trim());

            if (!response || !response.result) { // If update failed
                await this.delay(750);
                $('container').style.cursor = 'auto'; // Reset cursor

                let title = 'OOPS...';
                let message = 'There seemed to be an issue updating your vibes... please try again at another time.';
                let contextMenu = new ContextMenu(title, message, null, 'OK');
                $('context-menu').style.height = '160px';
                return await contextMenu.showSync(); // Show error context menu
            }
        }

        await this.delay(750); // Delay before showing success message
        $('container').style.cursor = 'auto'; // Reset cursor

        // Show success message
        let title = 'SAVED';
        let message = 'Profile updated.';
        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '150px';
        return await contextMenu.showSync(); // Show success context menu
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

// Instantiate Profile class
let profile = new Profile();