/*
Dynamically manages the Edit screen and its behaviors
Author Colby Roberts
*/
class EditParty {
    constructor() {
        // Bind the init function to this class instance when the body loads
        document.body.onload = this.init.bind(this);
    }

    async init() {
        // Initialize variables with DOM elements and values
        this.userId = parseInt($('userId').value); // User ID from the DOM
        this.partyId = parseInt($('partyId').value); // Party ID from the DOM
        this.title = $('title').innerHTML; // Party title

        // Default party settings
        this.partySettings = {
            privacy: 'Discoverable',
            startTime: '9:00 PM',
            vibes: '',
            description: ''
        }

        // Bind DOM elements to the class instance
        this.privacy = $('privacy'); // Privacy dropdown
        this.privacyInfo = $('privacyInfo'); // Privacy info text
        this.privacy.onchange = this.onChangePrivacy.bind(this); // Set privacy change event handler
        this.defaultPrivacy = this.privacy.value; // Store the default privacy setting

        this.startTime = $('startTime'); // Start time input
        this.startTime.onchange = this.onChangeStartTime.bind(this); // Set start time change event handler
        this.defaultStartTime = this.startTime.value; // Store the default start time

        // Time option elements
        this.eight = $('eightPM');
        this.eightthirty = $('eightthirtyPM');
        this.nine = $('ninePM');
        this.ninethirty = $('ninethirtyPM');
        this.ten = $('tenPM');
        this.tenthirty = $('tenthirtyPM');
        this.eleven = $('elevenPM');

        // Picture input
        this.picture = $('pictureImageUpload');
        this.picture.onchange = this.uploadPicture.bind(this); // Set picture upload handler
        this.defaultPictureBase64 = ''; // Default empty base64 picture

        this.pictureRequirements = $('picturesRequirements'); // Picture requirements info

        // Vibes input
        this.vibes = $('vibes');
        this.vibes.onkeyup = this.onKeyUpVibes.bind(this); // Set vibes keyup handler
        this.defaultVibes = this.vibes.value; // Store default vibes value

        // Description input
        this.description = $('description');
        this.description.onkeyup = this.onKeyUpDescription.bind(this); // Set description keyup handler
        this.defaultDescription = this.description.value; // Store default description

        this.descriptionRequirements = $('descriptionRequirements'); // Description requirements info
        this.vibesRequirement = $('vibesRequirements'); // Vibes requirements info

        // Default values object to compare against for changes
        this.defaultValues = {
            privacy: this.defaultPrivacy,
            startTime: this.defaultStartTime,
            vibes: this.defaultVibes,
            description: this.defaultDescription,
            pictureBase64: this.defaultPictureBase64
        };

        // Error requirements elements
        this.vibesBad = $('vibesBad');
        this.descriptionBad = $('descriptionBad');

        // Cancel and Save buttons
        this.cancelButton = $('cancelButton');
        this.cancelButton.onmousedown = this.onMouseDownCancelButton.bind(this); // Cancel button event

        this.saveButtonEnabled = false; // Flag to control save button status

        this.saveButton = $('saveButton');
        this.saveButton.onmousedown = this.onMouseDownSaveButton.bind(this); // Save button event

        this.reset(); // Reset all fields to default values
    }

    reset() {
        this.disableSaveButton(); // Disable the save button on reset

        // Reset the party settings to their defaults
        this.partySettings = {
            privacy: this.defaultPrivacy,
            startTime: this.defaultStartTime,
            vibes: this.defaultVibes,
            description: this.defaultDescription,
            pictureBase64: this.defaultPictureBase64
        }

        // Reset form fields to default values
        this.description.value = this.defaultDescription;
        this.picture.value = this.defaultPictureBase64;

        this.onChangePrivacy(); // Reset privacy setting

        this.hideVibesRequirement(); // Hide vibes requirement message
        this.hideDescriptionRequirement(); // Hide description requirement message
    }

    onChangePrivacy(evt) {
        // Update privacy info based on selected option
        switch(this.privacy.value) {
            case 'Discoverable':
                this.privacyInfo.innerHTML = 'Your party will be discoverable on the party home page and anyone can RSVP!';
                this.partySettings.privacy = 'Discoverable';
                break;

            case 'Public':
                this.privacyInfo.innerHTML = 'Your group will <i>not</i> be discoverable on the party home page and anyone of your followers and friends can RSVP!';
                this.partySettings.privacy = 'Public';
                break;

            case 'Private':
                this.privacyInfo.innerHTML = 'Your group will <i>not</i> be discoverable on the party home page and only people with a <i>unique personal private</i> invite link can RSVP!';
                this.partySettings.privacy = 'Private';
                break;

            default:
                this.privacyInfo.innerHTML = 'Oops there seems to be an error, please try again at another time.';
                this.disableSaveButton();
                this.partySettings.privacy = null;
                break;
        }

        this.updateSaveButton(evt); // Update the save button status after privacy change
    }

    async uploadPicture(evt) {
        // Upload a picture and validate the file size
        const file = evt.target.files[0];

        this.pictureRequirements.style.display = 'block'; // Show picture requirements

        if (file.size > 196608) { // Check if file size is larger than 200KB
            $('pictureGood').style.display = 'none'; // Hide good picture message
            this.picture.value = ''; // Clear the picture input

            // Show error message
            let title = 'OOPS...';
            let message = "Party picture size must be smaller than 200 kilobytes!";
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '150px';

            return await contextMenu.showSync(); // Show error dialog
        }

        const imageUrl = URL.createObjectURL(file); // Create an image URL
        this.partySettings.pictureBase64 = await this.encodeImageToBase64(imageUrl); // Convert image to base64

        $('pictureBad').style.display = 'none'; // Hide bad picture message
        $('pictureGood').style.display = 'list-item'; // Show good picture message

        this.updateSaveButton(evt); // Update save button
    }

    async encodeImageToBase64(imageUrl) {
        // Convert image URL to base64 format
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
                    const base64 = canvas.toDataURL('image/png'); // Convert to base64
                    resolve(base64);
                } catch (error) {
                    reject(error); // Reject if error occurs
                }
            };

            img.onerror = (error) => {
                reject(error); // Reject on image load error
            };
        });
    }

    onKeyUpVibes(evt) {
        // Handle vibes input change
        if (this.vibes.value.trim().length == 0) {
            this.showVibesRequirement(); // Show vibes requirement message
            this.partySettings.vibes = '';
            this.disableSaveButton(); // Disable save button
        } else {
            this.hideVibesRequirement(); // Hide vibes requirement message
            this.partySettings.vibes = this.vibes.value.trim(); // Save vibes value
            this.updateSaveButton(); // Update save button status
        }
    }

    onKeyUpDescription(evt) {
        // Handle description input change
        if (this.description.value.trim().length == 0) {
            this.showDescriptionRequirement(); // Show description requirement message
            this.partySettings.description = '';
            this.disableSaveButton(); // Disable save button
        } else {
            this.hideDescriptionRequirement(); // Hide description requirement message
            this.partySettings.description = this.description.value.trim(); // Save description
            this.updateSaveButton(); // Update save button status
        }
    }

    onChangeStartTime(evt) {
        // Update the start time setting
        this.partySettings.startTime = this.startTime.value;
        this.updateSaveButton(evt); // Update save button status
    }

    enableSaveButton(text = 'Save') {
        // Enable the save button
        this.saveButton.enabled = true;
        this.saveButton.classList.remove('buttonDisabled');
        this.saveButton.innerHTML = text;

        this.saveButtonEnabled = true;
    }

    disableSaveButton(text = 'Save') {
        // Disable the save button
        this.saveButton.enabled = false;
        this.saveButton.classList.add('buttonDisabled');
        this.saveButton.innerHTML = text;

        this.saveButtonEnabled = false;
    }

    updateSaveButton(evt) {
        // Update save button status based on if there are changes
        if (this.defaultValues.privacy == this.partySettings.privacy && this.defaultValues.startTime == this.partySettings.startTime && this.defaultValues.vibes == this.partySettings.vibes && this.defaultValues.description == this.partySettings.description && this.defaultValues.pictureBase64 == this.partySettings.pictureBase64) {
            this.disableSaveButton(); // Disable button if no changes
        } else {
            this.enableSaveButton(); // Enable button if there are changes
        }
    }

    onMouseDownCancelButton(evt) {
        // Redirect to the host page when cancel button is clicked
        window.location.href = '/host';
    }

    async onMouseDownSaveButton(evt) {
        // Handle save button click
        if (!this.saveButtonEnabled) { return false; } // Prevent saving if button is not enabled

        const data = this.partySettings; // Get party settings

        this.disableSaveButton('Processing'); // Disable button and show "Processing"

        $('container').style.cursor = 'progress'; // Show loading cursor

        const response = await api.edit.requestEditParty(this.partyId, this.userId, data.privacy, data.startTime, data.vibes, data.description, data.pictureBase64); // Send API request

        if (response && response.result) {
            await this.delay(750); // Wait for the server response

            $('container').style.cursor = 'auto'; // Reset cursor

            this.disableSaveButton(); // Reset save button

            await this.showConfirmDialog(data); // Show confirmation dialog
        } else {
            await this.showErrorDialog(response); // Show error dialog if request fails
        }

        await this.delay(250);

        window.location.href = '/host'; // Redirect to host page
    }

    async delay(timeMS) {
        // Delay helper function
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

    async showConfirmDialog(data) {
        // Show confirmation dialog after party is saved
        let title = `<b>${this.title}</b> Saved`;
        let message = `${this.title} has been edited successfully!`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '150px';

        await contextMenu.showSync();
    }

    async showErrorDialog(data) {
        // Show error dialog if there was an issue with the save
        console.log(data);

        let title = `Oops`;
        let message = data && data.error ? data.error : `Oops there seems to be an error, please try again at another time.`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '160px';

        await contextMenu.showSync();
    }

    hideVibesRequirement() {
        // Hide vibes requirement message
        this.vibesRequirement.style.display = 'none';
        this.vibesBad.style.display = 'none';
    }

    showVibesRequirement() {
        // Show vibes requirement message
        this.vibesRequirement.style.display = 'block';
        this.vibesBad.style.display = 'list-item';
    }

    hideDescriptionRequirement() {
        // Hide description requirement message
        this.descriptionRequirements.style.display = 'none';
        this.descriptionBad.style.display = 'none';
    }

    showDescriptionRequirement() {
        // Show description requirement message
        this.descriptionRequirements.style.display = 'block';
        this.descriptionBad.style.display = 'list-item';
    }
}

let editParty = new EditParty();

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }