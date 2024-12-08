/*
Creates the ContextMenu class for context menus
Author Colby Roberts
*/
class ContextMenu {
    // Constructor for creating a context menu
    constructor(title, message = '', cancel = 'Cancel', confirm = 'Confirm') {
        const wrap = $('wrap'); // Assuming 'wrap' is the container element for the menu

        // Create the main container for the context menu
        this.div = Core.createDiv(wrap, 'context-menu');

        // Create the title element for the context menu
        this.title = Core.createDiv(this.div, 'context-menu-title', '', title);

        // Create a container for the message within the context menu
        this.messageContainer = Core.createDiv(this.div, 'context-menu-message-container');

        // If there's a message, add it to the menu
        if (message.length > 0) {
            Core.createText(this.messageContainer, message);
        }

        // Create a container for the buttons within the context menu
        this.buttonsContainer = Core.createDiv(this.div, 'context-menu-buttons-container');

        // Create the cancel button if specified
        if (cancel) {
            this.cancel = Core.createDiv(this.buttonsContainer, 'context-menu-cancel', 'context-menu-button', cancel);
            this.cancel.onmousedown = this.hide.bind(this); // Hide the menu on cancel
        }

        // Create the confirm button if specified
        if (confirm) {
            this.confirm = Core.createDiv(this.buttonsContainer, 'context-menu-confirm', 'context-menu-button', confirm);
            this.confirm.onmousedown = (evt) => {
                this.hide(); // Hide the menu on confirm
                if (this.callback) {
                    this.callback(true); // Execute the callback with the result
                }
            };
        }
    }

    // Show the context menu and accept a callback for when the confirm button is clicked
    async show(callback) {
        this.callback = callback; // Set the callback function

        $('screen-cover').style.display = 'block'; // Show the screen overlay
        this.div.style.display = 'block'; // Show the context menu
    }

    // Show the context menu and return a promise that resolves when the confirm button is clicked
    async showSync() {
        return new Promise((resolve, reject) => {
            this.show(result => {
                resolve(result); // Resolve the promise with the result from the callback
            });
        });
    }

    // Hide the context menu
    hide() {
        $('screen-cover').style.display = 'none'; // Hide the screen overlay
        Core.removeElement(this.div); // Remove the context menu element from the DOM
    }

    // Set a custom function to run when the confirm button is clicked
    setConfirmOnMouseDown(func) {
        this.confirm.onmousedown = func.bind(this); // Bind the custom function to the confirm button
    }

    // Create an input field inside the context menu
    createInput(placeholder = '') {
        this.input = Core.createTextbox(this.messageContainer, 'context-menu-input', 'inputBox', placeholder);

        // Update the confirm button's onmousedown behavior to pass the input value
        this.confirm.onmousedown = ((evt) => {
            const userIdentifier = this.input.value.trim(); // Get the trimmed value from the input field

            this.hide(); // Hide the menu
            this.callback(userIdentifier); // Pass the input value to the callback
        }).bind(this);
    }

    // Get the value from the input field
    getInput() {
        return this.input.value; // Return the input value
    }

    // Create a select dropdown inside the context menu
    createSelect(placeholder, ...options) {
        this.select = Core.createSelect(this.messageContainer, 'context-menu-select', placeholder); // Create the select element
        this.optionDivs = []; // Store the option divs for potential later reference

        // Loop through the provided options and create option elements
        for (let option of options) {
            let optionDiv = Core.createElement(this.select, 'option', option, 'context-menu-option', option);
            this.optionDivs.push(optionDiv); // Store each created option element
        }

        // Update the confirm button's onmousedown behavior to pass the selected option
        this.confirm.onmousedown = ((evt) => {
            const selectedOption = this.select.value; // Get the selected option's value

            this.hide(); // Hide the menu
            this.callback(selectedOption); // Pass the selected option to the callback
        }).bind(this);
    }

    // Get the currently selected option from the select dropdown
    getOption() {
        return this.select.value; // Return the selected option's value
    }

    // Append a custom element (div) to the message container
    createElement(div) {
        this.messageContainer.appendChild(div); // Append the given div element to the message container
    }

    // Set a custom height for the context menu
    setHeight(height) {
        this.div.style.height = `${height}px`; // Set the height of the context menu div
    }

    // Delay function to pause execution for a specified amount of time
    async delay(timeMS) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(null); // Resolve the promise after the specified delay
            }, timeMS);
        });
    }
}