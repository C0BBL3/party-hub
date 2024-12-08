/*
Dynamically manages the Signup screen and its behaviors
Author Colby Roberts
*/
const transitionTime = 300; // Transition time between screens in milliseconds

class SignUpProcess {
    constructor() {
        // Initialize the signup process when the page loads
        document.body.onload = this.init.bind(this);
    }

    init() {
        // Initialize the data object with user inputs
        this.data = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            tags: '',
            description: '',
            isHost: 0,
            isPatron: 0
        };

        // Error message element
        this.errorMessage = $('errorMessage');

        // Username requirement elements
        this.usernameRequirements = $('usernameRequirements');
        this.usernameNotUniqueLoading = $('usernameNotUniqueLoading');
        this.usernameNotUnique = $('usernameNotUnique');
        this.usernameUnique = $('usernameUnique');
        this.usernameBad = $('usernameBad');
        this.usernameGood = $('usernameGood');
        this.onKeyUpUsernameTimeout = null;

        // Password requirement elements
        this.passwordRequirements = $('passwordRequirements');
        this.passwordBad = $('passwordBad');
        this.passwordGood = $('passwordGood');
        this.passwordAlphaBad = $('passwordAlphaBad');
        this.passwordAlphaGood = $('passwordAlphaGood');

        // Email requirement elements
        this.emailRequirements = $('emailRequirements');
        this.emailNotUniqueLoading = $('emailNotUniqueLoading');
        this.emailNotUnique = $('emailNotUnique');
        this.emailUnique = $('emailUnique');
        this.emailBad = $('emailBad');
        this.onKeyUpEmailTimeout = null;

        // Screen navigation state (CAT, EAI, WAY, TUAY)
        this.screen = 'CAT';

        // Screen elements
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
        this.way_emailInput.onkeyup = this.onKeyUpEmail.bind(this);
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

    // Username input handler
    async onKeyUpUsername() {
        this.eai_usernameInput.classList.remove('inputBox-error');
        clearTimeout(this.onKeyUpUsernameTimeout);
        this.onKeyUpUsernameTimeout = setTimeout(this._onKeyUpUsername.bind(this), 250);
    }

    // Validate and check if the username is unique
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

    // Check if username is unique
    async checkIfUniqueUsername(name) {
        const response = await api.signup.checkIfUniqueUsername(name);
        await this.delay(500);
        return response && response.result;
    }

    // Password input handler
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

    // Check if password contains non-alphabetic characters
    checkPasswordContainsNonAlpha(password) {
        for (let i = 0; i < password.length; i++) {
            let code = password.charCodeAt(i);
            if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
                return true;
            }
        }
        return false;
    }

    // Email input handler
    async onKeyUpEmail() {
        this.way_emailInput.classList.remove('inputBox-error');
        clearTimeout(this.onKeyUpEmailTimeout);
        this.onKeyUpEmailTimeout = setTimeout(this._onKeyUpEmail.bind(this), 250);
    }

    // Validate and check if the email is unique
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

    // Check if the email format is valid
    checkIfValidEmail(email) {
        const email_re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email_re.test(email);
    }

    // Check if email is unique
    async checkIfUniqueEmail(email) {
        const response = await api.signup.checkIfUniqueEmail(email);
        await this.delay(500);
        return response && response.result;
    }

    // Hide username uniqueness requirements
    hideUsernameUniqueRequirements() {
        this.usernameNotUniqueLoading.style.display = 'none';
        this.usernameNotUnique.style.display = 'none';
        this.usernameUnique.style.display = 'none';
    }

    // Show loading indication for username uniqueness check
    showUsernameUniqueRequirementLoading() {
        this.hideUsernameUniqueRequirements();
        this.usernameRequirements.style.display = 'block';
        this.usernameNotUniqueLoading.style.display = 'list-item';
    }

    // Show username is unique
    showUsernameUniqueRequirement() {
        this.hideUsernameUniqueRequirements();
        this.usernameRequirements.style.display = 'block';
        this.usernameUnique.style.display = 'list-item';
    }

    // Show username is not unique
    showUsernameNotUniqueRequirement() {
        this.hideUsernameUniqueRequirements();
        this.usernameRequirements.style.display = 'block';
        this.usernameNotUnique.style.display = 'list-item';
    }

    // Hide all username requirements
    hideUsernameRequirements() {
        this.usernameRequirements.style.display = 'none';
        this.usernameBad.style.display = 'none';
        this.usernameGood.style.display = 'none';
        this.hideUsernameUniqueRequirements();
    }

    // Show the bad username requirement
    showUsernameBadRequirement() {
        this.usernameRequirements.style.display = 'block';
        this.usernameBad.style.display = 'list-item';
        this.usernameGood.style.display = 'none';
    }

    // Show the good username requirement
    showUsernameGoodRequirement() {
        this.usernameRequirements.style.display = 'block';
        this.usernameBad.style.display = 'none';
        this.usernameGood.style.display = 'list-item';
    }

    // Hide all password requirements
    hidePasswordRequirements() {
        this.passwordAlphaGood.style.display = 'none';
        this.passwordAlphaBad.style.display = 'none';
        this.passwordGood.style.display = 'none';
        this.passwordBad.style.display = 'none';
    }

    // Show the bad password requirement
    showPasswordBadRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordBad.style.display = 'list-item';
        this.passwordGood.style.display = 'none';
    }

    // Show the good password requirement
    showPasswordGoodRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordBad.style.display = 'none';
        this.passwordGood.style.display = 'list-item';
    }

    // Show the password has non-alphabetic characters requirement
    showPasswordAlphaBadRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordAlphaBad.style.display = 'list-item';
        this.passwordAlphaGood.style.display = 'none';
    }

    // Show the password is valid requirement
    showPasswordAlphaGoodRequirement() {
        this.passwordRequirements.style.display = 'block';
        this.passwordAlphaBad.style.display = 'none';
        this.passwordAlphaGood.style.display = 'list-item';
    }

    // Hide email uniqueness requirements
    hideEmailUniqueRequirements() {
        this.emailNotUniqueLoading.style.display = 'none';
        this.emailNotUnique.style.display = 'none';
        this.emailUnique.style.display = 'none';
    }

    // Show loading indication for email uniqueness check
    showEmailUniqueRequirementLoading() {
        this.hideEmailUniqueRequirements();
        this.emailRequirements.style.display = 'block';
        this.emailNotUniqueLoading.style.display = 'list-item';
    }

    // Show email is unique
    showEmailUniqueRequirement() {
        this.hideEmailUniqueRequirements();
        this.emailRequirements.style.display = 'block';
        this.emailUnique.style.display = 'list-item';
    }

    // Show email is not unique
    showEmailNotUniqueRequirement() {
        this.hideEmailUniqueRequirements();
        this.emailRequirements.style.display = 'block';
        this.emailNotUnique.style.display = 'list-item';
    }

    // Show email bad requirement
    showEmailBadRequirement() {
        this.emailRequirements.style.display = 'block';
        this.emailBad.style.display = 'list-item';
    }

    // Hide all email requirements
    hideEmailRequirements() {
        this.emailRequirements.style.display = 'none';
        this.emailBad.style.display = 'none';
        this.emailUnique.style.display = 'none';
        this.emailNotUnique.style.display = 'none';
    }

    // Navigate back to the previous screen in the signup process
    onClickEAIBackButton() {
        if (this.screen === 'EAI') {
            this.navigateToCAT();
        } else if (this.screen === 'WAY') {
            this.navigateToEAI();
        } else if (this.screen === 'TUAY') {
            this.navigateToWAY();
        }
    }

    // Move to the next step of the signup process
    onClickEAINextButton() {
        if (this.screen === 'EAI') {
            this.navigateToWAY();
        }
    }

    // Navigate to the account type selection screen
    navigateToCAT() {
        this.cat.style.display = 'block';
        this.eai.style.display = 'none';
        this.screen = 'CAT';
    }

    // Navigate to the account information input screen
    navigateToEAI() {
        this.cat.style.display = 'none';
        this.eai.style.display = 'block';
        this.screen = 'EAI';
    }

    // Navigate to the user information input screen
    navigateToWAY() {
        this.eai.style.display = 'none';
        this.way.style.display = 'block';
        this.screen = 'WAY';
    }

    // Navigate to the final description screen
    navigateToTUAY() {
        this.way.style.display = 'none';
        this.tuay.style.display = 'block';
        this.screen = 'TUAY';
    }

    // Handle host button click
    onClickHostButton() {
        this.data.isHost = 1;
        this.navigateToEAI();
    }

    // Handle patron button click
    onClickPatronButton() {
        this.data.isPatron = 1;
        this.navigateToEAI();
    }
}