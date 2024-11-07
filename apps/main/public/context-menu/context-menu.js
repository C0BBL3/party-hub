class ContextMenu {
    constructor(title, message = '', cancel = 'Cancel', confirm = 'Confirm') {
        const wrap = $('wrap');

        this.div = Core.createDiv(wrap, 'context-menu');

        this.title = Core.createDiv(this.div, 'context-menu-title', '', title);

        this.messageContainer = Core.createDiv(this.div, 'context-menu-message-container');

        if (message.length > 0) {
            messageText = Core.createText(this.messageContainer, message);
        }

        this.buttonsContainer = Core.createDiv(this.div, 'context-menu-buttons-container');

        this.cancel = Core.createDiv(this.buttonsContainer, 'context-menu-cancel', 'context-menu-button', cancel);
        this.cancel.onmousedown = this.hide.bind(this);

        this.confirm = Core.createDiv(this.buttonsContainer, 'context-menu-confirm', 'context-menu-button', confirm);
        this.confirm.onmousedown = (evt) => {            
            this.hide();
            if (this.callback) {       
                this.callback(true);
            }
        };
    }

    async show(callback) {
        this.callback = callback;

        $('screen-cover').style.display = 'block';
        this.div.style.display = 'block';
    }

    async showSync() {
        return new Promise((resolve, reject) => {
            this.show(result => {
                resolve(result);                
            });
        }); 
    }

    hide() {
        $('screen-cover').style.display = 'none';
        Core.removeElement(this.div);
    }

    setConfirmOnMouseDown(func) {
        this.confirm.onmousedown = func.bind(this);
    }

    createInput(placeholder = '') {
        this.input = Core.createTextbox(this.messageContainer, 'context-menu-input', 'inputBox', placeholder);

        this.confirm.onmousedown = ((evt) => {
            const userIdentifier = this.input.value.trim();
      
            this.hide();
            this.callback(userIdentifier);
        }).bind(this);
    }

    getInput() {
        return this.input.value;
    }

    createSelect(placeholder, ...options) {
        this.select = Core.createSelect(this.messageContainer, 'context-menu-select', placeholder);
        this.optionDivs = [];

        for (let option of options) {
            let optionDiv = Core.createElement(this.select, 'option', option, 'context-menu-option', option);
            this.optionDivs.push(optionDiv);
        }

        this.confirm.onmousedown = ((evt) => {
            const selectedOption = this.select.value;
      
            this.hide();
            this.callback(selectedOption);
        }).bind(this);
    }

    getOption() {
        return this.select.value;
    }

    createElement(div) {
        this.messageContainer.appendChild(div);
    }

    setHeight(height) {
        this.div.style.height = `${height}px`;
    }

    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout((evt) => {
                resolve(null);
            }, timeMS);
        });
    }

}