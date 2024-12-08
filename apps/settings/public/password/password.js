/*
Dynamically manages the Password screen and its behaviors
Author Jack Davy, Colby Roberts
*/
class Password {
    constructor() {
        // Sets up the onload event handler for the body to initialize the Password class when the page loads
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
        // Initializes userId from an HTML element with id 'userId'
        this.userId = parseInt($('userId').value);

        // Timeout references for debouncing keyup events
        this.onKeyUpCurrentPasswordTimeout = null;

        // Elements related to current password input and requirements display
        this.currentPasswordInput = $('currentPassword');
        this.currentPasswordInput.onkeyup = this.onKeyUpCurrentPassword.bind(this);

        this.currentPasswordRequirements = $('currentPasswordRequirements');
        this.currentPasswordLoading = $('currentPasswordLoading');
        this.currentPasswordGood = $('currentPasswordGood');
        this.currentPasswordBad = $('currentPasswordBad');

        // Timeout references for debouncing keyup events for new password
        this.onKeyUpNewPasswordTimeout = null;

        // Elements related to new password input and requirements display
        this.newPasswordInput = $('newPassword');
        this.newPasswordInput.onkeyup = this.onKeyUpNewPassword.bind(this);

        // Elements related to confirming new password and its requirements display
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

        // The save button element
        this.saveButton = $('saveButton');
    }

    // Event handler when the user types in the current password input field
    onKeyUpCurrentPassword(evt) {
        // If the input is empty, hide the requirements
        if (this.currentPasswordInput.value.trim().length == 0) {
            this.hideCurrentPasswordRequirements();
            return;
        }

        // Clear previous timeout and set a new one to handle debounced checking
        clearTimeout(this.onKeyUpCurrentPasswordTimeout);
        this.onKeyUpCurrentPasswordTimeout = setTimeout(this._onKeyUpCurrentPassword.bind(this, evt), 250);
    }

    // Function that checks the current password asynchronously
    async _onKeyUpCurrentPassword(evt) {
        // If the new password field is empty, disable the save button
        if (this.newPasswordInput.value.trim().length == 0) {
            this.disableSaveButton();
        }

        // Show loading indicator for current password verification
        this.showCurrentPasswordLoadingRequirement();

        // Check if the current password is correct
        const correct = await this.checkIfCorrectPassword(this.currentPasswordInput.value);

        if (correct) {
            // Show the "good" requirement if the password is correct
            this.showCurrentPasswordGoodRequirement();

            // Enable the new password and confirm password fields for input
            this.newPasswordInput.style.cursor = 'auto';
            this.newPasswordInput.removeAttribute('readonly');

            this.newPasswordConfirmInput.style.cursor = 'auto';
            this.newPasswordConfirmInput.removeAttribute('readonly');

            // Validate the new password fields
            this.onKeyUpNewPassword();
        } else {
            // Show the "bad" requirement if the password is incorrect
            this.showCurrentPasswordBadRequirement();

            // Disable the new password and confirm password fields if incorrect
            this.newPasswordInput.style.cursor = 'not-allowed';
            this.newPasswordInput.setAttribute('readonly', true);

            this.newPasswordConfirmInput.style.cursor = 'not-allowed';
            this.newPasswordConfirmInput.setAttribute('readonly', true);

            // Disable the save button if the current password is wrong
            this.disableSaveButton();
        }
    }

    // Function to check if the current password is correct by calling the API
    async checkIfCorrectPassword(password) {
        const response = await api.password.verify(this.userId, password);
        await this.delay(500); // Simulate a delay for UI responsiveness
        return response && response.result;
    }

    // Helper function to hide all current password requirement elements
    hideCurrentPasswordRequirements() {
        this.currentPasswordRequirements.style.display = 'none';
        this.currentPasswordLoading.style.display = 'none';
        this.currentPasswordGood.style.display = 'none';
        this.currentPasswordBad.style.display = 'none';
    }

    // Show loading indicator while checking current password
    showCurrentPasswordLoadingRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordLoading.style.display = 'list-item';
    }

    // Show "good" requirement when the current password is correct
    showCurrentPasswordGoodRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordGood.style.display = 'list-item';
    }

    // Show "bad" requirement when the current password is incorrect
    showCurrentPasswordBadRequirement() {
        this.hideCurrentPasswordRequirements();
        this.currentPasswordRequirements.style.display = 'block';
        this.currentPasswordBad.style.display = 'list-item';
    }

    // Event handler for new password input
    onKeyUpNewPassword(evt) {
        // If the new password field is empty, hide requirements and disable the save button
        if (this.newPasswordInput.value.trim().length == 0) {
            this.hideNewPasswordRequirements();
            this.disableSaveButton();
            return;
        } else if (this.newPasswordInput.value.trim().length < 6) {
            // If the password is too short, show length requirement and disable the save button
            this.hideNewPasswordConfirmRequirements();
            this.showNewPasswordLengthBadRequirement();
            this.disableSaveButton();
        } else {
            // Show "good" length requirement and validate the password
            this.showNewPasswordLengthGoodRequirement();

            const valid = this.checkPasswordContainsNonAlpha(this.newPasswordInput.value);

            if (valid) {
                // Show "good" alpha requirement and validate password confirmation
                this.showNewPasswordAlphaGoodRequirement();

                if (this.newPasswordInput.value == this.newPasswordConfirmInput.value) {
                    // Show "good" confirmation if passwords match and enable save button
                    this.showNewPasswordConfirmGoodRequirement();
                    this.enableSaveButton();
                } else {
                    // Show "bad" confirmation if passwords don't match and disable save button
                    this.showNewPasswordConfirmBadRequirement();
                    this.disableSaveButton();
                }
            }
        }
    }

    // Helper function to check if the password contains non-alphabetic characters
    checkPasswordContainsNonAlpha(password) {
        for (let i = 0; i < password.length; i++) {
            let code = password.charCodeAt(i);
            if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) {
                return true;
            }
        }
        return false;
    }

    // Hide all new password requirement elements
    hideNewPasswordRequirements() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordRequirements.style.display = 'none';
        this.newPasswordLengthGood.style.display = 'none';
        this.newPasswordLengthBad.style.display = 'none';
        this.newPasswordAlphaGood.style.display = 'none';
        this.newPasswordAlphaBad.style.display = 'none';
    }

    // Hide new password confirmation requirement elements
    hideNewPasswordConfirmRequirements() {
        this.newPasswordConfirmRequirements.style.display = 'none';
        this.newPasswordConfirmGood.style.display = 'none';
        this.newPasswordConfirmBad.style.display = 'none';
    }

    // Show "good" length requirement for new password
    showNewPasswordLengthGoodRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordLengthGood.style.display = 'list-item';
    }

    // Show "bad" length requirement for new password
    showNewPasswordLengthBadRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordLengthBad.style.display = 'list-item';
    }

    // Show "good" alpha requirement for new password
    showNewPasswordAlphaGoodRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordAlphaGood.style.display = 'list-item';
    }

    // Show "bad" alpha requirement for new password
    showNewPasswordAlphaBadRequirement() {
        this.hideNewPasswordRequirements();
        this.newPasswordRequirements.style.display = 'block';
        this.newPasswordAlphaBad.style.display = 'list-item';
    }

    // Show "good" confirmation requirement for new password
    showNewPasswordConfirmGoodRequirement() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordConfirmRequirements.style.display = 'block';
        this.newPasswordConfirmGood.style.display = 'list-item';
    }

    // Show "bad" confirmation requirement for new password
    showNewPasswordConfirmBadRequirement() {
        this.hideNewPasswordConfirmRequirements();
        this.newPasswordConfirmRequirements.style.display = 'block';
        this.newPasswordConfirmBad.style.display = 'list-item';
    }

    // Disable the save button by adding a disabled class and removing click functionality
    disableSaveButton() {
        this.saveButton.classList.add('disabled');
        this.saveButton.onclick = null;
    }

    // Enable the save button by removing the disabled class and adding click functionality
    enableSaveButton() {
        this.saveButton.classList.remove('disabled');
        this.saveButton.onclick = this.onClickSaveButton.bind(this);
    }

    // Event handler for the save button click
    async onClickSaveButton() {
        const newPassword = this.newPasswordConfirmInput.value.trim();
        const update = await api.password.update(this.userId, newPassword);
    
        if (!update.result) {
            // Show an error message if the password update failed
            let title = 'OOPS...';
            let message = 'There seemed to be an issue updating your password... please try again at another time.';
    
            let contextMenu = new ContextMenu(title, message, null, 'OK');
            $('context-menu').style.height = '165px';
    
            return await contextMenu.showSync();
        }

        // Reload the page if the password was successfully updated
        document.location.reload();
    }

    // Helper function to introduce a delay (for simulating API call response time)
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

// Initialize the Password class when the script loads
let password = new Password();