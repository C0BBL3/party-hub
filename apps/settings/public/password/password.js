class Password {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
        this.userId = parseInt($('userId').value);

        this.onKeyUpCurrentPasswordTimeout = null;

        this.currentPasswordInput = $('currentPassword');
        this.currentPasswordInput.onkeyup = this.onKeyUpCurrentPassword.bind(this);

        this.currentPasswordRequirements = $('currentPasswordRequirements');
        this.currentPasswordLoading = $('currentPasswordLoading');
        this.currentPasswordGood = $('currentPasswordGood');
        this.currentPasswordBad = $('currentPasswordBad');

        this.onKeyUpNewPasswordTimeout = null;

        this.newPasswordInput = $('newPassword');
        this.newPasswordInput.onkeyup = this.onKeyUpNewPassword.bind(this);

        this.newPasswordConfirmInput = $('newPassword-confirm');
        this.newPasswordConfirmInput.onkeyup = this.onKeyUpNewPassword.bind(this);

        this.newPasswordRequirements = $('newPasswordRequirements');
        this.newPasswordLengthGood = $('newPasswordLengthGood');
        this.newPasswordLengthBad = $('newPasswordLengthBad');
        this.newPasswordAlphaGood = $('newPasswordAlphaGood');
        this.newPasswordAlphaBad = $('newPasswordAlphaBad');

        this.newPasswordConfirmRequirements = $('newPasswordConfirmRequirements');
        this.newPasswordConfirmGood = $('newPasswordConfirmGood');
        this.newPasswordConfirmBad = $('newPasswordConfirmBad');

        this.saveButton = $('saveButton');
    }

    onKeyUpCurrentPassword(evt) {
        if (this.currentPasswordInput.value.trim().length == 0) {
            this.hideCurrentPasswordRequirements();
            return;
        }

        clearTimeout(this.onKeyUpCurrentPasswordTimeout);
        this.onKeyUpCurrentPasswordTimeout = setTimeout(this._onKeyUpCurrentPassword.bind(this, evt), 250);
    }

    async _onKeyUpCurrentPassword(evt) {
        if (this.newPasswordInput.value.trim().length == 0) {
            this.disableSaveButton();
        }

        this.showCurrentPasswordLoadingRequirement();

        const correct = await this.checkIfCorrectPassword(this.currentPasswordInput.value);

        if (correct) {
            this.showCurrentPasswordGoodRequirement();

            this.newPasswordInput.style.cursor = 'auto';
            this.newPasswordInput.removeAttribute('readonly');

            this.newPasswordConfirmInput.style.cursor = 'auto';
            this.newPasswordConfirmInput.removeAttribute('readonly');

            this.onKeyUpNewPassword();
        } else {
            this.showCurrentPasswordBadRequirement();

            this.newPasswordInput.style.cursor = 'not-allowed';
            this.newPasswordInput.setAttribute('readonly', true);

            this.newPasswordConfirmInput.style.cursor = 'not-allowed';
            this.newPasswordConfirmInput.setAttribute('readonly', true);

            this.disableSaveButton();
        }
    }

    async checkIfCorrectPassword(password) {
        const response = await api.password.verify(this.userId, password);
        await this.delay(500);
        return response && response.result;
    }

    hideCurrentPasswordRequirements() {
        this.currentPasswordRequirements.style.display = 'none';
        this.currentPasswordLoading.style.display = 'none';
        this.currentPasswordGood.style.display = 'none';
        this.currentPasswordBad.style.display = 'none';
    }

    showCurrentPasswordLoadingRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordLoading.style.display = 'list-item';
    }

    showCurrentPasswordGoodRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordGood.style.display = 'list-item';
    }

    showCurrentPasswordBadRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordBad.style.display = 'list-item';
    }

    onKeyUpNewPassword(evt) {
        if (this.newPasswordInput.value.trim().length == 0) {
            this.hideNewPasswordRequirements();
            this.disableSaveButton();
            return;
        } else if (this.newPasswordInput.value.trim().length < 6) {
            this.hideNewPasswordConfirmRequirements();
            this.showNewPasswordLengthBadRequirement();
            this.disableSaveButton();
        } else {
            this.showNewPasswordLengthGoodRequirement();

            const valid = this.checkPasswordContainsNonAlpha(this.newPasswordInput.value);

            if (valid) {
                this.showNewPasswordAlphaGoodRequirement();

                if (this.newPasswordInput.value == this.newPasswordConfirmInput.value) {
                    this.showNewPasswordConfirmGoodRequirement();
                    this.enableSaveButton();
                } else {
                    this.showNewPasswordConfirmBadRequirement();
                    this.disableSaveButton();
                }
            }
        }
    }

    checkPasswordContainsNonAlpha(password) {
        for (let i = 0; i < password.length; i++) {
            let code = password.charCodeAt(i);
            if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
                return true;
            }
        }

        return false;
    }

    hideNewPasswordRequirements() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordRequirements.style.display = 'none';
        this.newPasswordLengthGood.style.display = 'none';
        this.newPasswordLengthBad.style.display = 'none';
        this.newPasswordAlphaGood.style.display = 'none';
        this.newPasswordAlphaBad.style.display = 'none';
    }

    hideNewPasswordConfirmRequirements() {
        this.newPasswordConfirmRequirements.style.display = 'none';
        this.newPasswordConfirmGood.style.display = 'none';
        this.newPasswordConfirmBad.style.display = 'none';
    }

    showNewPasswordLengthGoodRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordLengthGood.style.display = 'list-item';
    }

    showNewPasswordLengthBadRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordLengthBad.style.display = 'list-item';
    }

    showNewPasswordAlphaGoodRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordAlphaGood.style.display = 'list-item';
    }

    showNewPasswordAlphaBadRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordAlphaBad.style.display = 'list-item';
    }

    showNewPasswordConfirmGoodRequirement() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordConfirmRequirements.style.display = 'block';
        this.newPasswordConfirmGood.style.display = 'list-item';
    }

    showNewPasswordConfirmBadRequirement() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordConfirmRequirements.style.display = 'block';
        this.newPasswordConfirmBad.style.display = 'list-item';
    }

    disableSaveButton() {
        this.saveButton.classList.add('disabled');
        this.saveButton.onclick = null;
    }

    enableSaveButton() {
        this.saveButton.classList.remove('disabled');
        this.saveButton.onclick = this.onClickSaveButton.bind(this);
    }

    async onClickSaveButton() {
        const newPassword = this.newPasswordConfirmInput.value.trim();
        const update = await api.password.update(this.userId, newPassword);
    
        if (!update.result) {
            let title = 'OOPS...';
            let message = 'There seemed to be an issue updating your password... please try again at another time.';
    
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '165px';
    
            return await contextMenu.showSync();
        }

        document.location.reload();
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

let password = new Password();