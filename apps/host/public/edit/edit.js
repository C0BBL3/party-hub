class CreateParty {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    async init() {
        this.userId = parseInt($('userId').value);
        this.partyId = parseInt($('partyId').value);

        this.title = $('title').innerHTML;

        this.partySettings = {
            privacy: 'Discoverable',
            startTime: '9:00 PM',
            vibes: '',
            description: ''
        }

        // elements

        this.privacy = $('privacy');
        this.privacyInfo = $('privacyInfo');
        this.privacy.onchange = this.onChangePrivacy.bind(this);
        this.defaultPrivacy = this.privacy.value;

        this.startTime = $('startTime');
        this.startTime.onchange = this.onChangeStartTime.bind(this);
        this.defaultStartTime = this.startTime.value;

        this.eight = $('eight');
        this.eightthirty = $('eightthirty');
        this.nine = $('nine');
        this.ninethirty = $('ninethirty');
        this.ten = $('ten');
        this.tenthirty = $('tenthirty');
        this.eleven = $('eleven');

        this.vibes = $('vibes');
        this.vibes.onkeyup = this.onKeyUpVibes.bind(this);
        this.defaultVibes = this.vibes.value;

        this.description = $('description');
        this.description.onkeyup = this.onKeyUpDescription.bind(this);
        this.defaultDescription = this.description.value;

        this.descriptionRequirements = $('descriptionRequirements');
        this.vibesRequirement = $('vibesRequirements');

        this.defaultValues = {
            privacy: this.defaultPrivacy,
            startTime: this.defaultStartTime,
            vibes: this.defaultVibes,
            description: this.defaultDescription
        };

        // requirements

        this.vibesBad = $('vibesBad');

        this.descriptionBad = $('descriptionBad');

        // buttons

        this.cancelButton = $('cancelButton');
        this.cancelButton.onmousedown = this.onMouseDownCancelButton.bind(this);

        this.saveButtonEnabled = false;

        this.saveButton = $('saveButton');
        this.saveButton.onmousedown = this.onMouseDownSaveButton.bind(this);

        this.reset();
    }

    reset() {
        this.disableSaveButton();

        this.partySettings = {
            privacy: this.defaultPrivacy,
            startTime: this.defaultStartTime,
            vibes: this.defaultVibes,
            description: this.defaultDescription
        }

        this.description.value = this.defaultDescription;
        
        this.onChangePrivacy();

        this.hideVibesRequirement();
        this.hideDescriptionRequirement();
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
                this.disableSaveButton();
                this.partySettings.privacy = null;
                break;
        }

        this.updateSaveButton(evt);
    }

    onKeyUpVibes(evt) {
        if (this.vibes.value.trim().length == 0) {
            this.showVibesRequirement();
            this.partySettings.vibes = '';
            this.disableSaveButton();
        } else {
            this.hideVibesRequirement();
            this.partySettings.vibes = this.vibes.value.trim();
            this.updateSaveButton();
        }
    }

    onKeyUpDescription(evt) {
        if (this.description.value.trim().length == 0) {
            this.showDescriptionRequirement();
            this.partySettings.description = '';
            this.disableSaveButton();
        } else {
            this.hideDescriptionRequirement();
            this.partySettings.description = this.description.value.trim();
            this.updateSaveButton();
        }
    }

    onChangeStartTime(evt) {
        this.partySettings.startTime = this.startTime.value;
        this.updateSaveButton(evt);
    }

    enableSaveButton(text = 'Save') {
        this.saveButton.enabled = true;
        this.saveButton.classList.remove('buttonDisabled');
        this.saveButton.innerHTML = text;

        this.saveButtonEnabled = true;
    }

    disableSaveButton(text = 'Save') {
        this.saveButton.enabled = false;
        this.saveButton.classList.add('buttonDisabled');
        this.saveButton.innerHTML = text;

        this.saveButtonEnabled = false;
    }

    updateSaveButton(evt) {
        if (this.defaultValues.privacy == this.partySettings.privacy && this.defaultValues.startTime == this.partySettings.startTime && this.defaultValues.vibes == this.partySettings.vibes && this.defaultValues.description == this.partySettings.description) {
            this.disableSaveButton();
        } else {
            this.enableSaveButton();
        }
    }

    onMouseDownCancelButton(evt) {
        window.location.href = '/host';
    }

    async onMouseDownSaveButton(evt) {
        if (!this.saveButtonEnabled) { return false; }

        const data = this.partySettings;

        this.disableSaveButton('Processing');

        $('container').style.cursor = 'progress';

        const response = await api.edit.requestEditParty(this.partyId, this.userId, data.privacy, data.startTime, data.vibes, data.description);
        
        if (response && response.result) {
            await this.delay(750);

            $('container').style.cursor = 'auto';
    
            this.disableSaveButton();
    
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
        let title = `<b>${this.title}</b> Saved`;
        let message = `${this.title} has been edited successfully!`;

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