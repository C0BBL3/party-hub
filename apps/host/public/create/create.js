class CreateParty {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
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
            description: ''
        }

        // elements

        this.titleInput = $('title');
        this.titleInput.onkeyup = this.onKeyUpTitle.bind(this);
        this.onKeyUpTitleTimeout = null;

        this.titleRequirements = $('titleRequirements');

        this.streetAddress = $('streetAddress');
        this.streetAddress.onchange = this.onChangeAddress.bind(this);
        this.streetAddress.onkeyup = this.onChangeAddress.bind(this);

        this.postalCode = $('postalCode');
        this.postalCode.onchange = this.onChangeAddress.bind(this);
        this.postalCode.onkeyup = this.onChangeAddress.bind(this);
        
        this.city = $('city');
        this.city.onchange = this.onChangeAddress.bind(this);
        this.city.onkeyup = this.onChangeAddress.bind(this);
        
        this.state = $('state');
        this.state.onchange = this.onChangeAddress.bind(this);
        this.state.onkeyup = this.onChangeAddress.bind(this);
        

        this.privacy = $('privacy');
        this.privacyInfo = $('privacyInfo');
        this.privacy.onchange = this.onChangePrivacy.bind(this);

        this.startDate = $('startDate');
        this.startDate.onchange = this.onChangeStartDate.bind(this);

        this.thursday = $('thursday');
        this.friday = $('friday');
        this.saturday = $('saturday');
        this.sunday = $('sunday');

        this.startTime = $('startTime');
        this.startTime.onchange = this.onChangeStartTime.bind(this);

        this.eight = $('eight');
        this.eightthirty = $('eightthirty');
        this.nine = $('nine');
        this.ninethirty = $('ninethirty');
        this.ten = $('ten');
        this.tenthirty = $('tenthirty');
        this.eleven = $('eleven');

        this.vibes = $('vibes');
        this.vibes.onkeyup = this.onKeyUpVibes.bind(this);

        this.description = $('description');
        this.description.onkeyup = this.onKeyUpDescription.bind(this);

        this.descriptionRequirements = $('descriptionRequirements');
        this.vibesRequirement = $('vibesRequirements');

        // requirements

        this.titleNotUniqueLoading = $('titleNotUniqueLoading');
        this.titleNotUnique = $('titleNotUnique');
        this.titleUnique = $('titleUnique');
        
        this.vibesBad = $('vibesBad');

        this.descriptionBad = $('descriptionBad');

        // buttons

        this.createButtonEnabled = false;

        this.createButton = $('createButton');
        this.createButton.onmousedown = this.onMouseDownCreateButton.bind(this);

        this.reset();
    }

    reset() {
        this.disableCreateButton();

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
            description: ''
        }

        this.titleInput.value = '';
        
        this.streetAddress.value = '';
        this.postalCode.value = '';
        this.city.value = '';
        this.state.value = '';
        
        this.privacy.value = 'Discoverable';
        this.startDate.value = 'Friday';
        this.startTime.value = '9:00 PM';

        this.description.value = '';
        
        this.onKeyUpTitle();
        this.onChangePrivacy();

        this.hideTitleUniqueRequirement();
        this.hideVibesRequirement();
        this.hideDescriptionRequirement();
    }

    async onKeyUpTitle() {
        clearTimeout(this.onKeyUpTitleTimeout);
        this.onKeyUpTitleTimeout = setTimeout(this._onKeyUpTitle.bind(this), 250);
    }

    async _onKeyUpTitle() {
        if (this.titleInput.value.trim().length == 0) {
            this.hideTitleUniqueRequirement();
            this.disableCreateButton(); 
            this.partySettings.title = '';
        } else {
            this.showTitleUniqueRequirementLoading();
            const unique = await this.checkIfUniqueTitle(this.titleInput.value);

            if (unique) {
                this.showTitleUniqueRequirement();
                this.partySettings.title = this.titleInput.value.trim();
                this.updateCreateButton();
            } else {
                this.showTitleNotUniqueRequirement();
                this.partySettings.title = '';
                this.disableCreateButton();
            }
        }
    }

    async checkIfUniqueTitle(title) {
        const response = await api.create.checkIfUniquePartyTitle(title);
        await this.delay(500);
        return response && response.result;
    }

    onChangeAddress() {
        if (this.streetAddress.value.trim().length == 0 || this.postalCode.value.trim().length == 0 || this.city.value.trim().length == 0 || this.state.value.trim().length == 0) {
            this.partySettings.address = {
                streetAddress: '',
                postalCode: 0,
                city: '',
                state: ''
            };
            this.disableCreateButton();
        } else if (this.streetAddress.value.trim().length > 0 && this.postalCode.value.trim().length > 0 && this.city.value.trim().length > 0 && this.state.value.trim().length > 0) {
            this.partySettings.address = {
                streetAddress: this.streetAddress.value.trim(),
                postalCode: parseInt(this.postalCode.value.trim()),
                city: this.city.value.trim(),
                state: this.state.value.trim()
            };
            this.updateCreateButton();
        } 
    }

    onChangePrivacy(evt) {
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
                this.disableCreateButton();
                this.partySettings.privacy = null;
                break;
        }
    }

    onKeyUpVibes(evt) {
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
        this.partySettings.startDate = this.startDate.value;
    }

    onChangeStartTime(evt) {
        this.partySettings.startTime = this.startTime.value;
    }

    toggleAdditionalExplanation(type, show, evt) {
        evt.stopPropagation();

        let primary = $(type + 'PrimaryExplanation');
        primary.style.display = !show ? 'flex' : 'none';

        let additional = $(type + 'AdditionalExplanation');
        additional.style.display = show ? 'block' : 'none';
    }

    enableCreateButton(text = 'Create') {
        this.createButton.enabled = true;
        this.createButton.classList.remove('buttonDisabled');
        this.createButton.innerHTML = text;

        this.createButtonEnabled = true;
    }

    disableCreateButton(text = 'Create') {
        this.createButton.enabled = false;
        this.createButton.classList.add('buttonDisabled');
        this.createButton.innerHTML = text;

        this.createButtonEnabled = false;
    }

    updateCreateButton(evt) {
        if (this.partySettings.title.length == 0 || this.partySettings.description.length == 0 || this.partySettings.vibes.length == 0 || this.streetAddress.value.trim().length == 0 || this.postalCode.value.trim().length == 0 || this.city.value.trim().length == 0 || this.state.value.trim().length == 0) {
            this.disableCreateButton();
        } else {
            this.enableCreateButton();
        }
    }

    async onMouseDownCreateButton(evt) {
        if (!this.createButtonEnabled) { return false; }

        const data = this.partySettings;

        this.disableCreateButton('Processing');

        $('container').style.cursor = 'progress';

        const response = await api.create.requestCreateParty(data.title, data.address, data.privacy, data.start, data.vibes, data.description);
        
        if (response && response.result) {
            await this.delay(750);

            $('container').style.cursor = 'auto';
    
            this.disableCreateButton();
    
            await this.showConfirmDialog(data);
        } else {
            await this.showErrorDialog(response);
        }

        await this.delay(250);

        window.location.href = '/host';
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

    async showConfirmDialog(data) {
        let title = `<b>${data.title.charAt(0).toUpperCase()}${data.title.slice(1)}</b> Created`;
        let message = `${data.title.charAt(0).toUpperCase()}${data.title.slice(1)} has been created successfully!`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '150px';

        await contextMenu.showSync();
    }

    async showErrorDialog(data) {
        console.log(data);

        let title = `Oops`;
        let message = data && data.error ? data.error : `Oops there seems to be an error, please try again at another time.`;

        let contextMenu = new ContextMenu(title, message, null, 'OK');
        $('context-menu').style.height = '160px';

        await contextMenu.showSync();
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