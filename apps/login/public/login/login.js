class LoginProcess {
    constructor() {
        document.body.onload = this.init.bind(this);
    }

    init() {
        this.errorMessage = $('errorMessage');
        
        this.usernameOrEmailInput = $('usernameOrEmail-input');
        this.usernameOrEmailInput.onkeyup = () => { $('usernameOrEmail-input').classList.remove('inputBox-error'); }

        this.passwordInput = $('password-input');
        this.passwordInput.onkeyup = () => { $('password-input').classList.remove('inputBox-error'); }


        this.loginButton = $('loginButton');
        this.loginButton.onmousedown = this.onClickLoginButton.bind(this);
    }

    async onClickLoginButton(event) {
        this.errorMessage.innerHTML = '';

        $('wrap').style.cursor = 'progress';
        
        let process = await api.login.process(this.usernameOrEmailInput.value, this.passwordInput.value);

        if (process.result) {
            setTimeout(() => { $('wrap').style.cursor = 'auto'; window.location.href = '/party/feed'; }, 750);
        } else {
            this.errorMessage.innerHTML = process.errorMessage;

            this.usernameOrEmailInput.classList.add('inputBox-error');
            this.passwordInput.classList.add('inputBox-error');
        }
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }
}

loginProcess = new LoginProcess();