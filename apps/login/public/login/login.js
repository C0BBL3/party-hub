/*
Dynamically manages the Login screen and its behaviors
Author Colby Roberts
*/
class LoginProcess {
    // Constructor that initializes the LoginProcess when the page loads
    constructor() {
        document.body.onload = this.init.bind(this);  // Binds the init function to the current instance of LoginProcess
    }

    init() {
        // This function initializes the UI elements and event listeners
        
        // Get the error message element by its ID
        this.errorMessage = $('errorMessage');
        
        // Set up the username or email input element
        this.usernameOrEmailInput = $('usernameOrEmail-input');
        // Event listener for keyup to remove the error class when typing
        this.usernameOrEmailInput.onkeyup = () => { $('usernameOrEmail-input').classList.remove('inputBox-error'); }

        // Set up the password input element
        this.passwordInput = $('password-input');
        // Event listener for keyup to remove the error class when typing
        this.passwordInput.onkeyup = () => { $('password-input').classList.remove('inputBox-error'); }

        // Set up the login button
        this.loginButton = $('loginButton');
        // Event listener for mouse down on the login button
        this.loginButton.onmousedown = this.onClickLoginButton.bind(this);
    }

    // This function is triggered when the login button is clicked
    async onClickLoginButton(event) {
        this.errorMessage.innerHTML = '';  // Clear any previous error messages

        // Change cursor to a "progress" spinner while processing
        $('wrap').style.cursor = 'progress';
        
        // Call the API to process the login
        let process = await api.login.process(this.usernameOrEmailInput.value, this.passwordInput.value);

        if (process.result) {
            // If login is successful, redirect after a short delay
            setTimeout(() => { 
                $('wrap').style.cursor = 'auto';  // Reset the cursor
                window.location.href = '/party/rsvp';  // Redirect to the RSVP page
            }, 750);
        } else {
            // If login fails, display the error message
            this.errorMessage.innerHTML = process.errorMessage;

            // Add error styles to the input fields
            this.usernameOrEmailInput.classList.add('inputBox-error');
            this.passwordInput.classList.add('inputBox-error');
        }
    }

    // A helper function to delay execution for a given time (in milliseconds)
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);  // Resolve the promise after the delay
            }, timeMS);
        });
    }
}

// Instantiate the LoginProcess to activate it on the page
loginProcess = new LoginProcess();