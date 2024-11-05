class Password {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
        this.userId = parseInt( $('userId').value);


        this.currentPasswordTextbox =  $('currentPasswordTextbox');
        this.currentPasswordErrorMessage =  $('currentPasswordErrorMessage');

        this.toggleCurrentPassword =  $('toggleCurrentPassword');

        if (this.toggleCurrentPassword) {
            this.toggleCurrentPassword.onclick = this.onToggleCurrentPassword.bind(this);
        }

        this.requireCurrentPassword = this.currentPasswordTextbox ? true : false;


        this.newPasswordTextbox =  $('newPasswordTextbox');
        
        this.toggleNewPassword =  $('toggleNewPassword');
        this.toggleNewPassword.onclick = this.onToggleNewPassword.bind(this);


        this.newPasswordErrorMessage =  $('newPasswordErrorMessage');

        this.saveButton =  $('saveButton');
        this.saveButton.onclick = this.onMouseDownSaveButton.bind(this);

        this.disableSaveButton();

        if (this.requireCurrentPassword) {
            this.monitorForUpdates(this.currentPasswordTextbox);
        }

        this.monitorForUpdates(this.newPasswordTextbox);
    }

    onToggleCurrentPassword(event) {
        const type = this.currentPasswordTextbox.getAttribute('type') === 'password' ? 'text' : 'password';
        this.currentPasswordTextbox.setAttribute('type', type);

        this.toggleCurrentPassword.classList.toggle('fa-eye-slash');
    }

    onToggleNewPassword(event) {
        const type = this.newPasswordTextbox.getAttribute('type') === 'password' ? 'text' : 'password';
        this.newPasswordTextbox.setAttribute('type', type);

        this.toggleNewPassword.classList.toggle('fa-eye-slash');
    }

    monitorForUpdates(input) {
        input.onchange = this.processUpdates.bind(this);
        input.onkeyup = this.processUpdates.bind(this); 
        input.onpaste = this.processUpdates.bind(this); 
    }

    processUpdates(evt) {
        let data = this.getUpdatedData();

        if (this.requireCurrentPassword) {            
            if (data.currentPassword.length === 0) {
                this.toggleCurrentPassword.style.visibility = 'hidden';
                this.disableSaveButton();
                return;
            } else {
                this.toggleCurrentPassword.style.visibility = 'visible';
            }
        }
        
        if (data.newPassword.length === 0) {
            this.toggleNewPassword.style.visibility = 'hidden';
            this.disableSaveButton();            
            return;
        } else {
            this.toggleNewPassword.style.visibility = 'visible';
        }
 
        let numChanges = Object.keys(data).length;

        if (numChanges > 0) {
            this.enableSaveButton();
        } else {
            this.hideFieldError('currentPassword');
            this.hideFieldError('newPassword');

            this.disableSaveButton();
        }
    }

    async onMouseDownSaveButton(evt) {
        if (this.saveButton.enabled) {
            let data = this.getUpdatedData();

            if (this.validateData(data)) {
                this.hideFieldErrors();

                this.saveButton.innerHTML = 'Saving Changes...';  

                data.userId = this.userId;

                let response = await APISync.updatePassword(data);

                if (!response.error) {
                    this.disableSaveButton('Changes Saved');      

                    if (this.requireCurrentPassword) {
                        this.updateValue(data, 'currentPassword');
                    }

                    this.updateValue(data, 'newPassword');
                } else {

                    this.disableSaveButton();

                    let error = response.error;
                    this.showFieldError(error.fieldName, error.message);
                }
            } else {
                this.disableSaveButton();
            }
        }
    }

    updateValue(data, fieldName) {
        this[fieldName] = data[fieldName] && data[fieldName] !== this[fieldName] ? data[fieldName] : this[fieldName];
    }

    getUpdatedData() {
        let data = {};

        if (this.requireCurrentPassword) {
            let currentPassword = this.currentPasswordTextbox.value.trim();
            if (currentPassword !== this.currentPassword) {
                data.currentPassword = currentPassword;
            }
        }

        let newPassword = this.newPasswordTextbox.value.trim();
        if (newPassword !== this.newPassword) {
            data.newPassword = newPassword;
        }

        return data;
    }

    enableSaveButton(text = 'Save Changes') {
        this.saveButton.enabled = true;
        this.saveButton.classList.add('buttonEnabled') 
        this.saveButton.innerHTML = text;  
    }

    disableSaveButton(text = 'Save Changes') {
        this.saveButton.enabled = false;
        this.saveButton.classList.remove('buttonEnabled') 
        this.saveButton.innerHTML = text;  
    }

    validateData(data) {
        let valid = true;

        if (this.requireCurrentPassword) {
            if (!this.validatePasswordField(data, 'currentPassword')) { valid = false; }
        }

        if (!this.validatePasswordField(data, 'newPassword')) { valid = false; }

        return valid;
    }

    validatePasswordField(fieldName, data) {
        if (!data.hasOwnProperty(fieldName)) { return true; }

        if (!this.validatePassword(data[fieldName])) {
            let errorMessage = 'Passwords must be between 8 and 30 characters';
            this.showFieldError(fieldName, errorMessage);
            return false 
        } else {
            this.hideFieldError(fieldName);
            return true;
        }
    }

    validatePassword(password) {
        if (password.length < 8 || password.length > 30) {  
            return false;
        }

        return true;
    }
    
    showFieldError(fieldName, errorMessage) {
        this[` ${fieldName}Textbox`].classList.add('error');  
        this[` ${fieldName}ErrorMessage`].innerHTML = errorMessage;
        this[` ${fieldName}ErrorMessage`].style.display = 'block';
    }

    hideFieldError(fieldName) {
        this[` ${fieldName}Textbox`].classList.remove('error');  
        this[` ${fieldName}ErrorMessage`].innerHTML = '';
        this[` ${fieldName}ErrorMessage`].style.display = 'none';
    }

    hideFieldErrors() {
        if (this.requireCurrentPassword) {
            this.hideFieldError('currentPassword');
        }
        this.hideFieldError('newPassword');
    }
}

password = new Password();

const transitionTime = 300; // ms

class SignUpProcess {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    init() {

        this.data = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            vibes: '',
            description: '',
            isHost: 0,
            isPatron: 0
        };

        this.errorMessage = $('errorMessage');

        this.usernameRequirements =  $('usernameRequirements');

        this.usernameNotUniqueLoading =  $('usernameNotUniqueLoading');
        this.usernameNotUnique =  $('usernameNotUnique');
        this.usernameUnique =  $('usernameUnique');

        this.usernameBad =  $('usernameBad');
        this.usernameGood =  $('usernameGood');

        this.onKeyUpUsernameTimeout = null;

        this.passwordRequirements =  $('passwordRequirements');

        this.passwordBad =  $('passwordBad');
        this.passwordGood =  $('passwordGood');

        this.passwordAlphaBad =  $('passwordAlphaBad');
        this.passwordAlphaGood =  $('passwordAlphaGood');

        this.emailRequirements =  $('emailRequirements');

        this.emailNotUniqueLoading =  $('emailNotUniqueLoading');
        this.emailNotUnique =  $('emailNotUnique');
        this.emailUnique =  $('emailUnique');

        this.emailBad =  $('emailBad');

        this.onKeyUpEmailTimeout = null;
        
        // CAT: Choose Account Type
        // EAI: Enter Account Information
        // WAY: Who Are You
        // TUAY: Tell Us About Yourself
        
        this.screen = 'CAT';

        this.cat = $('chooseAccountType');

        this.hostButton = $('chooseAccountType-host');
        this.hostButton.onclick = this.onClickHostButton.bind(this);

        this.patronButton = $('chooseAccountType-patron');
        this.patronButton.onclick = this.onClickPatronButton.bind(this);
        
        this.eai = $('enterAccountInformation');

        this.eai_usernameInput = $('enterAccountInformation-username-input');
        this.eai_usernameInput.onkeyup = this.onKeyUpUsername.bind(this);

        this.eai_passwordInput = $('enterAccountInformation-password-input');
        this.eai_passwordInput.onkeyup = this.onKeyUpPassword.bind(this);

        this.eai_nextButton = $('enterAccountInformation-nextButton');
        this.eai_nextButton.onmousedown = this.onClickEAINextButton.bind(this);

        this.eai_backButton = $('enterAccountInformation-backButton');
        this.eai_backButton.onmousedown = this.onClickEAIBackButton.bind(this);

        this.way = $('whoAreYou');

        this.way_firstNameInput = $('whoAreYou-firstName-input');
        this.way_lastNameInput = $('whoAreYou-lastName-input');
        this.way_emailInput = $('whoAreYou-email-input');
        this.way_emailInput.onkeyup = this.onKeyUpEmail.bind(this)

        this.way_nextButton = $('whoAreYou-nextButton');
        this.way_nextButton.onmousedown = this.onClickWAYNextButton.bind(this);

        this.way_backButton = $('whoAreYou-backButton');
        this.way_backButton.onmousedown = this.onClickWAYBackButton.bind(this);

        this.tuay = $('tellUsAboutYourself');

        this.tuay_vibesInput = $('tellUsAboutYourself-vibes-input');
        this.tuay_descriptionInput = $('tellUsAboutYourself-description-input');

        this.tuay_finishButton = $('tellUsAboutYourself-finishButton');
        this.tuay_finishButton.onmousedown = this.onClickTUAYFinishButton.bind(this);

        this.tuay_backButton = $('tellUsAboutYourself-backButton');
        this.tuay_backButton.onmousedown = this.onClickTUAYBackButton.bind(this);
    }

    async onKeyUpUsername() {
        this.eai_usernameInput.classList.remove('inputBox-error');

        clearTimeout(this.onKeyUpUsernameTimeout);
        this.onKeyUpUsernameTimeout = setTimeout(this._onKeyUpUsername.bind(this), 250);
    }

    async _onKeyUpUsername() {
        if (this.eai_usernameInput.value.trim().length == 0) {
            this.hideUsernameRequirements();
            this.disableEAINextButton(); 
        } else if (this.eai_usernameInput.value.trim().length < 3) {
            this.showUsernameBadRequirement();
            this.disableEAINextButton();
        } else {
            this.showUsernameGoodRequirement();
            this.showUsernameUniqueRequirementLoading();
            const unique = await this.checkIfUniqueUsername(this.eai_usernameInput.value);

            if (unique) {
                this.showUsernameUniqueRequirement();
                this.updateEAINextButton();
            } else {
                this.showUsernameNotUniqueRequirement();
                this.disableEAINextButton();
            }
        }
    }

    async checkIfUniqueUsername(name) {
        const response = await api.signup.checkIfUniqueUsername(name);
        await this.delay(500);
        return response && response.result;
    }

    async onKeyUpPassword() {
        this.eai_passwordInput.classList.remove('inputBox-error');

        if (this.eai_passwordInput.value.trim().length == 0) {
            this.hidePasswordRequirements();
            this.disableEAINextButton(); 
        } else if (this.eai_passwordInput.value.trim().length < 6) {
            this.showPasswordBadRequirement();
            this.disableEAINextButton();
        } else {
            this.showPasswordGoodRequirement();
            const valid = this.checkPasswordContainsNonAlpha(this.eai_passwordInput.value);

            if (valid) {
                this.showPasswordAlphaGoodRequirement();
                this.updateEAINextButton();
            } else {
                this.showPasswordAlphaBadRequirement();
                this.disableEAINextButton();
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

    async onKeyUpEmail() {
        this.way_emailInput.classList.remove('inputBox-error');

        clearTimeout(this.onKeyUpEmailTimeout);
        this.onKeyUpEmailTimeout = setTimeout(this._onKeyUpEmail.bind(this), 250);
    }

    async _onKeyUpEmail() {
        if (this.way_emailInput.value.trim().length == 0) {
            this.hideEmailRequirements();
            this.disableWAYNextButton(); 
        } else if (!this.checkIfValidEmail(this.way_emailInput.value)) {
            this.hideEmailUniqueRequirements();
            this.showEmailBadRequirement();
            this.disableWAYNextButton();
        } else {
            this.showEmailUniqueRequirementLoading();
            this.hideEmailBadRequirement();
            const unique = await this.checkIfUniqueEmail(this.way_emailInput.value);

            if (unique) {
                this.showEmailUniqueRequirement();
                this.enableWAYNextButton();
            } else {
                this.showEmailNotUniqueRequirement();
                this.disableWAYNextButton();
            }
        }
    }

    checkIfValidEmail(email) {
        const email_re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email_re.test(email);
    }

    async checkIfUniqueEmail(email) {
        const response = await api.signup.checkIfUniqueEmail(email);
        await this.delay(500);
        return response && response.result;
    }    

    hideUsernameUniqueRequirements() {
        this.usernameNotUniqueLoading.style.display = 'none';
        this.usernameNotUnique.style.display = 'none';
        this.usernameUnique.style.display = 'none';
    }

    showUsernameUniqueRequirementLoading() {
        this.hideUsernameUniqueRequirements();

        this.usernameRequirements.style.display = 'block';
        this.usernameNotUniqueLoading.style.display = 'list-item';
    }

    showUsernameUniqueRequirement() {
        this.hideUsernameUniqueRequirements();

        this.usernameRequirements.style.display = 'block';
        this.usernameUnique.style.display = 'list-item';
    }

    showUsernameNotUniqueRequirement() {
        this.hideUsernameUniqueRequirements();

        this.usernameRequirements.style.display = 'block';
        this.usernameNotUnique.style.display = 'list-item';
    }

    hideUsernameRequirements() {
        this.usernameRequirements.style.display = 'none';
        this.usernameBad.style.display = 'none';
        this.usernameGood.style.display = 'none';
        
        this.hideUsernameUniqueRequirements();
    }

    showUsernameBadRequirement() {
        this.usernameRequirements.style.display = 'block';
        this.usernameBad.style.display = 'list-item';
        this.usernameGood.style.display = 'none';
    }

    showUsernameGoodRequirement() {
        this.usernameRequirements.style.display = 'block';
        this.usernameBad.style.display = 'none';
        this.usernameGood.style.display = 'list-item';
    }

    hidePasswordRequirements() {
        this.passwordAlphaGood.style.display = 'none';
        this.passwordAlphaBad.style.display = 'none';
        this.passwordGood.style.display = 'none';
        this.passwordBad.style.display = 'none';
    }

    showPasswordBadRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordBad.style.display = 'list-item';
        this.passwordGood.style.display = 'none';
    }

    showPasswordGoodRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordBad.style.display = 'none';
        this.passwordGood.style.display = 'list-item';
    }

    showPasswordAlphaBadRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordAlphaBad.style.display = 'list-item';
        this.passwordAlphaGood.style.display = 'none';
    }

    showPasswordAlphaGoodRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordAlphaBad.style.display = 'none';
        this.passwordAlphaGood.style.display = 'list-item';
    }

    hideEmailUniqueRequirements() {
        this.emailNotUniqueLoading.style.display = 'none';
        this.emailNotUnique.style.display = 'none';
        this.emailUnique.style.display = 'none';
    }

    showEmailUniqueRequirementLoading() {
        this.hideEmailUniqueRequirements();

        this.emailRequirements.style.display = 'block';
        this.emailNotUniqueLoading.style.display = 'list-item';
    }

    showEmailUniqueRequirement() {
        this.hideEmailUniqueRequirements();

        this.emailRequirements.style.display = 'block';
        this.emailUnique.style.display = 'list-item';
    }

    showEmailNotUniqueRequirement() {
        this.hideEmailUniqueRequirements();

        this.emailRequirements.style.display = 'block';
        this.emailNotUnique.style.display = 'list-item';
    }

    hideEmailRequirements() {
        this.emailRequirements.style.display = 'none';
        this.emailBad.style.display = 'none';
        
        this.hideEmailUniqueRequirements();
    }

    showEmailBadRequirement() {
        this.emailRequirements.style.display = 'block';
        this.emailBad.style.display = 'list-item';
    }

    hideEmailBadRequirement() {
        this.emailBad.style.display = 'none';
    }

    disableEAINextButton() {
        this.eai_nextButton.classList.add('disabled');
    }

    enableEAINextButton() {
        this.eai_nextButton.classList.remove('disabled');
    }

    onClickHostButton(event) {
        this.data.isHost = 1;
        this.data.isPatron = 0;

        this.onClickHostOrPatronButton(event);
    }

    onClickPatronButton(event) {
        this.data.isHost = 0;
        this.data.isPatron = 1;

        this.onClickHostOrPatronButton(event);
    }

    onClickHostOrPatronButton(event) {
        this.errorMessage.innerHTML = '';

        this.screen = 'EAI';

        this.eai.classList.add('enterRight');
        this.eai.style.display = 'block';

        this.cat.classList.add('leaveLeft');
        
        let timeout1;
        timeout1 = setTimeout(this.hideCAT.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showEAI.bind(this, timeout2), 0); // needs to be async via timeout idk why silly js and css interation ig
    }

    onClickEAIBackButton(event) {
        this.errorMessage.innerHTML = '';

        this.screen = 'CAT';

        this.cat.classList.add('enterLeft');
        this.cat.style.display = 'block';

        this.eai.classList.add('leaveRight');
        
        let timeout1;
        timeout1 = setTimeout(this.hideEAI.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showCAT.bind(this, timeout2), 0);// needs to be async via timeout idk why silly js and css interation ig
    }

    onClickEAINextButton(event) {
        this.errorMessage.innerHTML = '';

        this.resetEAI();

        this.data.username = this.eai_usernameInput.value;
        this.data.password = this.eai_passwordInput.value;

        if (this.data.username.length == 0 && this.data.password.length == 0) {
            this.errorMessage.innerHTML = 'Oops.. it looks like you didnt enter a username or password! Please enter a username and password!';

            this.eai_usernameInput.classList.add('inputBox-error');
            this.eai_passwordInput.classList.add('inputBox-error');

            return;
        } else if (this.data.username.length == 0) {
            this.errorMessage.innerHTML = 'Oops.. it looks like you didnt enter a username! Please enter a username!';

            this.eai_usernameInput.classList.add('inputBox-error');

            return;
        } else if (this.data.password.length == 0) {
            this.errorMessage.innerHTML = 'Oops.. it looks like you didnt enter a password! Please enter a password!';

            this.eai_passwordInput.classList.add('inputBox-error');

            return;
        } 

        this.screen = 'WAY';

        this.way.classList.add('enterRight');
        this.way.style.display = 'block';

        this.eai.classList.add('leaveLeft');
        
        let timeout1;
        timeout1 = setTimeout(this.hideEAI.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showWAY.bind(this, timeout2), 0); // needs to be async via timeout idk why silly js and css interation ig
    }

    onClickWAYNextButton(event) {
        this.errorMessage.innerHTML = '';

        this.resetWAY();

        this.data.firstName = this.way_firstNameInput.value;
        this.data.lastName = this.way_lastNameInput.value;
        this.data.email = this.way_emailInput.value;

        if (this.data.email.length == 0) {
            this.errorMessage.innerHTML = 'Oops.. it looks like you didnt enter an email! Please enter an email!';

            this.way_emailInput.classList.add('inputBox-error');
            return;
        } 

        this.screen = 'TUAY';

        this.tuay.classList.add('enterRight');
        this.tuay.style.display = 'block';

        this.way.classList.add('leaveLeft');
        
        let timeout1;
        timeout1 = setTimeout(this.hideWAY.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showTUAY.bind(this, timeout2), 0);// needs to be async via timeout idk why silly js and css interation ig
    }

    onClickWAYBackButton(event) {
        this.errorMessage.innerHTML = '';

        this.screen = 'EAI';

        this.eai.classList.add('enterLeft');
        this.eai.style.display = 'block';

        this.way.classList.add('leaveRight');
        
        let timeout1;
        timeout1 = setTimeout(this.hideWAY.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showEAI.bind(this, timeout2), 0);// needs to be async via timeout idk why silly js and css interation ig
    }

    onClickTUAYBackButton(event) {
        this.errorMessage.innerHTML = '';

        this.screen = 'WAY';

        this.way.classList.add('enterLeft');
        this.way.style.display = 'block';

        this.tuay.classList.add('leaveRight');
        
        let timeout1;
        timeout1 = setTimeout(this.hideTUAY.bind(this, timeout1), transitionTime);

        let timeout2;
        timeout2 = setTimeout(this.showWAY.bind(this, timeout2), 0);// needs to be async via timeout idk why silly js and css interation ig
    }

    async onClickTUAYFinishButton(event) {
        this.errorMessage.innerHTML = '';

        this.resetTUAY();

        this.data.vibes = this.tuay_vibesInput.value;
        this.data.description = this.tuay_descriptionInput.value;

        let data = this.trimData();

        $('wrap').style.cursor = 'progress';
        
        let process = await api.signup.process(data);

        if (process.result) {
            setTimeout(() => { $('wrap').style.cursor = 'auto'; window.location.href = '/party/feed'; }, 750);
        } else {
            this.errorMessage.innerHTML = 'Oops... there seems to be an error signing you up, please try again later!';
        }
       
    }

    trimData() {
        let data = {};

        for (let key in this.data) {
            try {
                data[key] = this.data[key].trim();
            } catch {
                data[key] = this.data[key];
            }
        }

        return data;
    }

    showCAT(timeout) {
        clearTimeout(timeout);
        this.cat.style.display = 'block';
        this.cat.className = 'screen enter';
        setTimeout(this.resetCAT.bind(this), transitionTime);
    }

    hideCAT(timeout) {
        clearTimeout(timeout);
        this.cat.style.display = 'none';
        this.resetEAI();
    }

    resetCAT() {
        this.cat.className = 'screen';
    }

    showEAI(timeout) {
        clearTimeout(timeout);
        this.eai.style.display = 'block';
        this.eai.className = 'screen enter';
        setTimeout(this.resetEAI.bind(this), transitionTime);
    }

    hideEAI(timeout) {
        clearTimeout(timeout);
        this.eai.style.display = 'none';
        this.resetEAI();
    }

    resetEAI() {
        this.eai.className = 'screen';

        this.eai_usernameInput.classList.remove('inputBox-error');
        this.eai_passwordInput.classList.remove('inputBox-error');
    }

    showWAY(timeout) {
        clearTimeout(timeout);
        this.way.style.display = 'block';
        this.way.className = 'screen enter';
        setTimeout(this.resetWAY.bind(this), transitionTime);
    }

    hideWAY(timeout) {
        clearTimeout(timeout);
        this.way.style.display = 'none';
        this.resetWAY();
    }

    resetWAY() {
        this.way.className = 'screen';
        this.way_emailInput.classList.remove('inputBox-error');
    }

    showTUAY(timeout) {
        clearTimeout(timeout);
        this.tuay.style.display = 'block';
        this.tuay.className = 'screen enter';
        setTimeout(this.resetTUAY.bind(this), transitionTime);
    }

    hideTUAY(timeout) {
        clearTimeout(timeout);
        this.tuay.style.display = 'none';
        this.resetTUAY();
    }

    resetTUAY() {
        this.tuay.className = 'screen';
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

    async updateEAINextButton() {
        let validUsername = await api.signup.checkIfUniqueUsername(this.eai_usernameInput.value.trim());

        if (this.eai_usernameInput.value.trim().length < 3 || !validUsername) {
            this.disableEAINextButton();
            return;
        }

        let validPassword = this.checkPasswordContainsNonAlpha(this.eai_passwordInput.value.trim())

        if (this.eai_passwordInput.value.trim().length < 6 || !validPassword) {
            this.disableEAINextButton();
            return;
        }

        this.enableEAINextButton();
    }

    disableEAINextButton() {
        this.eai_nextButton.classList.add('disabled');
        this.eai_nextButton.onmousedown = null;
    }

    enableEAINextButton() {
        this.eai_nextButton.classList.remove('disabled');
        this.eai_nextButton.onmousedown = this.onClickEAINextButton.bind(this);
    }

    disableWAYNextButton() {
        this.way_nextButton.classList.add('disabled');
        this.way_nextButton.onmousedown = null;
    }

    enableWAYNextButton() {
        this.way_nextButton.classList.remove('disabled');
        this.way_nextButton.onmousedown = this.onClickWAYNextButton.bind(this);
    }
}

signUpProcess = new SignUpProcess();
