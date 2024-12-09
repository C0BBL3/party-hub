/*
Dynamically manages the Create screen and its behaviors
Author Colby Roberts
*/
class CreateParty {
    constructor() {
        document.body.onload = this.init.bind(this); // Initialize when the body is loaded
    }

    async init() {
        // Default party settings
        this.partySettings = {
            title: '',
            address: {
                streetAddress: '',
                postalCode: 0,
                city: '',
                state: ''
            },
            privacy: 'Discoverable',
            start: {
                date: 'Friday',
                time: '9:00 PM'
            },
            vibes: '',
            description: '',
            pictureBase64: ''
        }

        // Elements for input fields and events
        this.titleInput = $('title'); // Title input field
        this.titleInput.onkeyup = this.onKeyUpTitle.bind(this); // Trigger on keyup in title
        this.onKeyUpTitleTimeout = null;

        this.titleRequirements = $('titleRequirements'); // Title requirements display

        this.streetAddress = $('streetAddress'); // Street address input
        this.streetAddress.onchange = this.onChangeAddress.bind(this); // Trigger address change
        this.streetAddress.onkeyup = this.onChangeAddress.bind(this); // Trigger address change on keyup

        this.postalCode = $('postalCode'); // Postal code input
        this.postalCode.onchange = this.onChangeAddress.bind(this); // Trigger address change
        this.postalCode.onkeyup = this.onChangeAddress.bind(this); // Trigger address change on keyup
        
        this.city = $('city'); // City input
        this.city.onchange = this.onChangeAddress.bind(this); // Trigger address change
        this.city.onkeyup = this.onChangeAddress.bind(this); // Trigger address change on keyup
        
        this.state = $('state'); // State input
        this.state.onchange = this.onChangeAddress.bind(this); // Trigger address change
        this.state.onkeyup = this.onChangeAddress.bind(this); // Trigger address change on keyup

        this.privacy = $('privacy'); // Privacy setting dropdown
        this.privacyInfo = $('privacyInfo'); // Privacy info display
        this.privacy.onchange = this.onChangePrivacy.bind(this); // Change privacy setting

        this.startDate = $('startDate'); // Start date dropdown
        this.startDate.onchange = this.onChangeStartDate.bind(this); // Trigger on start date change

        this.thursday = $('thursday'); // Days of the week checkboxes
        this.friday = $('friday');
        this.saturday = $('saturday');
        this.sunday = $('sunday');

        this.startTime = $('startTime'); // Start time dropdown
        this.startTime.onchange = this.onChangeStartTime.bind(this); // Trigger on time change

        this.eight = $('eightPM'); // Time slots
        this.eightthirty = $('eightthirtyPM');
        this.nine = $('ninePM');
        this.ninethirty = $('ninethirtyPM');
        this.ten = $('tenPM');
        this.tenthirty = $('tenthirtyPM');
        this.eleven = $('elevenPM');

        this.picture = $('pictureImageUpload'); // Picture upload input
        this.picture.onchange = this.uploadPicture.bind(this); // Trigger on picture upload
        this.pictureRequirements = $('picturesRequirements'); // Picture requirements display

        this.vibes = $('vibes'); // Vibes input field
        this.vibes.onkeyup = this.onKeyUpVibes.bind(this); // Trigger on keyup in vibes

        this.description = $('description'); // Description input field
        this.description.onkeyup = this.onKeyUpDescription.bind(this); // Trigger on keyup in description

        this.descriptionRequirements = $('descriptionRequirements'); // Description requirements display
        this.vibesRequirement = $('vibesRequirements'); // Vibes requirement display

        // Elements for validation and display requirements
        this.titleNotUniqueLoading = $('titleNotUniqueLoading'); // Title not unique loading display
        this.titleNotUnique = $('titleNotUnique'); // Title not unique message
        this.titleUnique = $('titleUnique'); // Title is unique message
        
        this.vibesBad = $('vibesBad'); // Vibes bad message
        this.descriptionBad = $('descriptionBad'); // Description bad message

        // Create button logic
        this.createButtonEnabled = false;

        this.createButton = $('createButton'); // Create button
        this.createButton.onmousedown = this.onMouseDownCreateButton.bind(this); // Trigger on mouse down

        this.reset(); // Initialize the form with default values
    }

    reset() {
        this.disableCreateButton(); // Disable the create button

        // Reset all party settings to default
        this.partySettings = {
            title: '',
            address: {
                streetAddress: '',
                postalCode: 0,
                city: '',
                state: ''
            },
            privacy: 'Discoverable',
            start: {
                date: 'Friday',
                time: '9:00 PM'
            },
            vibes: '',
            description: '',
            pictureBase64: ''
        }

        // Clear all input fields
        this.titleInput.value = '';
        this.streetAddress.value = '';
        this.postalCode.value = '';
        this.city.value = '';
        this.state.value = '';
        this.privacy.value = 'Discoverable';
        this.startDate.value = 'Friday';
        this.startTime.value = '9:00 PM';
        this.description.value = '';
        
        // Trigger validation on fields
        this.onKeyUpTitle();
        this.onChangePrivacy();

        // Hide validation messages
        this.hideTitleUniqueRequirement();
        this.hideVibesRequirement();
        this.hideDescriptionRequirement();
    }

    async onKeyUpTitle() {
        // Delay the title check to avoid multiple requests on fast typing
        clearTimeout(this.onKeyUpTitleTimeout);
        this.onKeyUpTitleTimeout = setTimeout(this._onKeyUpTitle.bind(this), 250);
    }

    async _onKeyUpTitle() {
        // Check if title is empty or unique
        if (this.titleInput.value.trim().length == 0) {
            this.hideTitleUniqueRequirement(); // Hide unique title requirement
            this.disableCreateButton(); 
            this.partySettings.title = '';
        } else {
            this.showTitleUniqueRequirementLoading(); // Show loading indicator
            const unique = await this.checkIfUniqueTitle(this.titleInput.value); // Check if title is unique

            if (unique) {
                this.showTitleUniqueRequirement(); // Show title is unique
                this.partySettings.title = this.titleInput.value.trim(); // Set title
                this.updateCreateButton(); // Update create button status
            } else {
                this.showTitleNotUniqueRequirement(); // Show title not unique
                this.partySettings.title = ''; // Reset title
                this.disableCreateButton(); // Disable create button
            }
        }
    }

    async checkIfUniqueTitle(title) {
        // Check if the title is unique by making an API call
        const response = await api.create.checkIfUniquePartyTitle(title);
        await this.delay(500); // Simulate delay for user experience
        return response && response.result;
    }

    onChangeAddress() {
        // Triggered when address inputs change, validate and update address
        if (this.streetAddress.value.trim().length == 0 || this.postalCode.value.trim().length == 0 || this.city.value.trim().length == 0 || this.state.value.trim().length == 0) {
            this.partySettings.address = {
                streetAddress: '',
                postalCode: 0,
                city: '',
                state: ''
            };
            this.disableCreateButton(); // Disable button if any address field is empty
        } else if (this.streetAddress.value.trim().length > 0 && this.postalCode.value.trim().length > 0 && this.city.value.trim().length > 0 && this.state.value.trim().length > 0) {
            this.partySettings.address = {
                streetAddress: this.streetAddress.value.trim(),
                postalCode: parseInt(this.postalCode.value.trim()),
                city: this.city.value.trim(),
                state: this.state.value.trim()
            };
            this.updateCreateButton(); // Enable button when all address fields are filled
        } 
    }

    onChangePrivacy(evt) {
        // Handle privacy settings and update the corresponding info text
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
                this.disableCreateButton(); // Disable button if privacy is invalid
                this.partySettings.privacy = null;
                break;
        }
    }

    async uploadPicture(evt) {
        // Handle picture upload, validate size, and encode to base64
        const file = evt.target.files[0];

        this.pictureRequirements.style.display = 'block'; // Show picture requirements

        if (file.size > 196608) { // Limit file size to 200KB
            $('pictureBad').style.display = 'list-item'; // Show error message
            $('pictureGood').style.display = 'none';
            this.picture.value = ''; // Reset picture field

            let title = 'OOPS...';
            let message = "Party picture size must be smaller than 200 kilobytes!";

            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '150px';

            return await contextMenu.showSync(); // Show error dialog
        }

        // Encode image to base64 for storage
        const imageUrl = URL.createObjectURL(file);
        this.partySettings.pictureBase64 = await this.encodeImageToBase64(imageUrl);

        $('pictureBad').style.display = 'none'; // Hide error message
        $('pictureGood').style.display = 'list-item'; // Show success message

        this.updateCreateButton(evt); // Update create button status
    }

    async encodeImageToBase64(imageUrl) {
        // Convert image to base64 encoding for storage
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Handle cross-origin images
            img.src = imageUrl;
    
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
    
                try {
                    const base64 = canvas.toDataURL('image/png');
                    resolve(base64); // Resolve with the base64 data
                } catch (error) {
                    reject(error); // Reject if an error occurs
                }
            };
    
            img.onerror = (error) => {
                reject(error); // Reject if image loading fails
            };
        });
    }

    onKeyUpVibes(evt) {
        // Validate vibes input and show requirements
        if (this.vibes.value.trim().length == 0) {
            this.showVibesRequirement();
            this.partySettings.vibes = '';
            this.disableCreateButton();
        } else {
            this.hideVibesRequirement();
            this.partySettings.vibes = this.vibes.value.trim();
            this.updateCreateButton();
        }
    }

    onKeyUpDescription(evt) {
        // Validate description input and show requirements
        if (this.description.value.trim().length == 0) {
            this.showDescriptionRequirement();
            this.partySettings.description = '';
            this.disableCreateButton();
        } else {
            this.hideDescriptionRequirement();
            this.partySettings.description = this.description.value.trim();
            this.updateCreateButton();
        }
    }

    onChangeStartDate(evt) {
        // Update party start date
        this.partySettings.start.date = this.startDate.value;
    }

    onChangeStartTime(evt) {
        // Update party start time
        this.partySettings.start.time = this.startTime.value;
    }

    toggleAdditionalExplanation(type, show, evt) {
        evt.stopPropagation();

        let primary = $(type + 'PrimaryExplanation');
        primary.style.display = !show ? 'flex' : 'none';

        let additional = $(type + 'AdditionalExplanation');
        additional.style.display = show ? 'block' : 'none';
    }

    enableCreateButton(text = 'Create') {
        // Enable create button with custom text
        this.createButton.enabled = true;
        this.createButton.classList.remove('buttonDisabled');
        this.createButton.innerHTML = text;

        this.createButtonEnabled = true;
    }

    disableCreateButton(text = 'Create') {
        // Disable create button with custom text
        this.createButton.enabled = false;
        this.createButton.classList.add('buttonDisabled');
        this.createButton.innerHTML = text;

        this.createButtonEnabled = false;
    }

    updateCreateButton(evt) {
        // Check if all fields are valid and enable or disable the create button
        if (this.partySettings.title.length == 0 || this.partySettings.description.length == 0 || this.partySettings.vibes.length == 0 || this.streetAddress.value.trim().length == 0 || this.postalCode.value.trim().length == 0 || this.city.value.trim().length == 0 || this.state.value.trim().length == 0 || this.picture.value.trim().length == 0) {
            this.disableCreateButton(); // Disable button if any field is empty
        } else {
            this.enableCreateButton(); // Enable button if all fields are filled
        }
    }

    async onMouseDownCreateButton(evt) {
        // Handle create button click and send party creation request
        if (!this.createButtonEnabled) { return false; }

        const data = this.partySettings;

        this.disableCreateButton('Processing'); // Disable button while processing

        $('container').style.cursor = 'progress'; // Show loading cursor

        const response = await api.create.requestCreateParty(data.title, data.address, data.privacy, data.start, data.vibes, data.description, data.pictureBase64);
        
        if (response && response.result) {
            await this.delay(750); // Wait before redirect

            $('container').style.cursor = 'auto'; // Reset cursor
    
            this.disableCreateButton();
    
            await this.showConfirmDialog(data); // Show confirmation dialog
        } else {
            await this.showErrorDialog(response); // Show error dialog
        }

        await this.delay(250);

        window.location.href = '/host'; // Redirect after success
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null); // Wait for the specified time
            }, timeMS);
        });
    }

    async showConfirmDialog(data) {
        // Show confirmation dialog after party is created
        let title = `<b>${data.title.charAt(0).toUpperCase()}${data.title.slice(1)}</b> Created`;
        let message = `${data.title.charAt(0).toUpperCase()}${data.title.slice(1)} has been created successfully!`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '150px';

        await contextMenu.showSync(); // Display dialog
    }

    async showErrorDialog(data) {
        console.log(data);

        let title = `Oops`;
        let message = data && data.error ? data.error : `Oops there seems to be an error, please try again at another time.`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '160px';

        await contextMenu.showSync(); // Display dialog
    }

    hideTitleUniqueRequirement() {
        this.titleRequirements.style.display = 'none';
        this.titleUnique.style.display = 'none';
        this.titleNotUnique.style.display = 'none';
        this.titleNotUniqueLoading.style.display = 'none';
    }

    showTitleUniqueRequirementLoading() {
        this.titleRequirements.style.display = 'block';
        this.titleUnique.style.display = 'none';
        this.titleNotUnique.style.display = 'none';
        this.titleNotUniqueLoading.style.display = 'list-item';
    }

    showTitleUniqueRequirement() {
        this.titleRequirements.style.display = 'block';
        this.titleUnique.style.display = 'list-item';
        this.titleNotUnique.style.display = 'none';
        this.titleNotUniqueLoading.style.display = 'none';
    }

    showTitleNotUniqueRequirement() {
        this.titleRequirements.style.display = 'block';
        this.titleUnique.style.display = 'none';
        this.titleNotUnique.style.display = 'list-item';
        this.titleNotUniqueLoading.style.display = 'none';
    }

    hideVibesRequirement() {
        this.vibesRequirement.style.display = 'none';
        this.vibesBad.style.display = 'none';
    }

    showVibesRequirement() {
        this.vibesRequirement.style.display = 'block';
        this.vibesBad.style.display = 'list-item';
    }

    hideDescriptionRequirement() {
        this.descriptionRequirements.style.display = 'none';
        this.descriptionBad.style.display = 'none';
    }

    showDescriptionRequirement() {
        this.descriptionRequirements.style.display = 'block';
        this.descriptionBad.style.display = 'list-item';
    }
}

let createParty = new CreateParty();

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }