class Password {
    constructor() {
        document.body.onload = this.init.bind(this);      
    }
    
    init() {        
        this.userId = parseInt($('userId').value);


        this.currentPasswordTextbox = $('currentPasswordTextbox');
        this.currentPasswordErrorMessage = $('currentPasswordErrorMessage');

        this.toggleCurrentPassword = $('toggleCurrentPassword');

        if (this.toggleCurrentPassword) {
            this.toggleCurrentPassword.onclick = this.onToggleCurrentPassword.bind(this);
        }

        this.requireCurrentPassword = this.currentPasswordTextbox ? true : false;


        this.newPasswordTextbox = $('newPasswordTextbox');
        
        this.toggleNewPassword = $('toggleNewPassword');
        this.toggleNewPassword.onclick = this.onToggleNewPassword.bind(this);


        this.newPasswordErrorMessage = $('newPasswordErrorMessage');

        this.saveButton = $('saveButton');
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
        this[`${fieldName}Textbox`].classList.add('error');  
        this[`${fieldName}ErrorMessage`].innerHTML = errorMessage;
        this[`${fieldName}ErrorMessage`].style.display = 'block';
    }

    hideFieldError(fieldName) {
        this[`${fieldName}Textbox`].classList.remove('error');  
        this[`${fieldName}ErrorMessage`].innerHTML = '';
        this[`${fieldName}ErrorMessage`].style.display = 'none';
    }

    hideFieldErrors() {
        if (this.requireCurrentPassword) {
            this.hideFieldError('currentPassword');
        }
        this.hideFieldError('newPassword');
    }
}

password = new Password();

function previewImage(event) {
    const image = document.getElementById('profileImage');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {
        URL.revokeObjectURL(image.src); 
    };
}


document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-button');
    const saveButton = document.getElementById('saveButton');
    const nameDisplay = document.getElementById('nameDisplay');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const splitNameContainer = document.getElementById('splitNameContainer');

    // Combine First and Last Name for display
    function updateNameDisplay() {
        nameDisplay.value = `${firstNameInput.value} ${lastNameInput.value}`.trim();
    }

    updateNameDisplay();

    // Edit button functionality
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            if (targetId === 'nameDisplay') {
                if (splitNameContainer.style.display === 'none') {
                    splitNameContainer.style.display = 'flex';
                    nameDisplay.style.display = 'none';
                    button.textContent = 'Done';
                } else {
                    splitNameContainer.style.display = 'none';
                    nameDisplay.style.display = 'block';
                    button.textContent = 'Edit';
                    updateNameDisplay();
                }
            } else {
                const inputField = document.getElementById(targetId);
                if (inputField.hasAttribute('readonly')) {
                    inputField.removeAttribute('readonly');
                    inputField.focus();
                    button.textContent = 'Done';
                } else {
                    inputField.setAttribute('readonly', true);
                    button.textContent = 'Edit';
                }
            }
        });
    });

    saveButton.addEventListener('click', () => {
        const fieldsToSave = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            description: document.getElementById('description').value,
            hashtags: document.getElementById('hashtags').value
        };

        console.log('Saving changes:', fieldsToSave);
        alert("Changes Saved!");
    });
});