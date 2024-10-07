Core.Button = Class.extend({
	_construct: function(options) {
        this.element = document.getElementById(options.id);

		if (!this.element) {
			this.element = document.createElement('div');
			this.element.id = options.id;
		}

        this.defaultClass = options.defaultClass ? options.defaultClass : 'button';
        this.element.className = this.defaultClass;

        var self = this;

        this.element.onclick = function() {
            self.onClick(self);
        }
    },
    setText: function(text) {
        this.element.innerHTML = text;
    },
    onClick: function(button) {},

    show: function() {
        this.element.style.visibility = '';
    },
    hide: function() {
        this.element.style.visibility = 'hidden';
    },
    enable: function() {
        this.enabled = true;
        this.element.className = self.defaultClass;
    },
    disable: function() {
        this.enabled = false;
        this.element.className = self.disabledClass;
    }
});

var menus = {};

Core.showMenu = function(options) {
    if (menus)
    menu = op
} 

Core.Menu = Class.extend({
	_construct: function(options) {
        this.options = options;

        this.element = $(options.id);
        if (this.element) {
            this.destroy();
        }

        this.menuButton = options.menuButton;

		this.element = document.createElement('div');
		this.element.id = options.id;
		this.element.style.position = 'absolute';
		this.element.className = options.menuClass ? options.menuClass : 'menu';

        this.element.style.zIndex = 1000;

        this.element.onmouseout = (evt) => {            
            this.mouseoverFlag = false;    

            if (this.options.hideOnMouseOut) {
                this.hideTimer = setTimeout(this.hide.bind(this), 50);
            }
        }

        if (this.options.hideOnMouseOut) {
            this.menuButton.onmouseout = (evt) => {            
                this.hideTimer = setTimeout(this.hide.bind(this), 50);                
            }
        }

        this.element.onmouseover = (evt) => {      
            clearTimeout(this.hideTimer);
        }
        
        document.body.appendChild(this.element);

        this.items = [];

        this.hide();

        document.body.addEventListener('mousedown', this.hide.bind(this), false);
    },
    onHide: function() {},
	destroy: function() {
		Core.removeElement(this.element);
	},
    addItems: function(items) {
        for(let item of items) {
            this.addItem(item);
        }
    },
    addItem: function(options) {
        // Default is visible unless explcitly set to false
        options.visible = (options.visible === false ? false : true);

        if (options.visible) {
            var item = new Core.MenuItem(this, options)
            this.items.push(item);

            return item;
        } else {
            return null;
        }
    },
    
    setLeft: function(left) {
        this.left = left;
        this.element.style.left = left + 'px';
    },

    setTop: function(top) {
        this.top = top;
        this.element.style.top = top + 'px';
    },

    getWidth: function() {
        return Core.getWidth(this.element);
    },

    getHeight: function() {
        return Core.getHeight(this.element);
    },

    show: function() {          
        if (this.menuButton) {
            let menuButtonWidth = Core.getWidth(this.menuButton);
            let menuButtonHeight = Core.getHeight(this.menuButton);
            let menuWidth = Core.getWidth(this.element);

            let left;

            if (this.options.alignment === 'left') {
                left = Core.findLeft(this.menuButton)
            } else {
                left = Core.findLeft(this.menuButton) - menuWidth + menuButtonWidth;
            }

            if (this.options.leftOffset) {
                left += this.options.leftOffset;
            }

            let top = Core.findTop(this.menuButton) + menuButtonHeight;
            this.setLeft(left);
            this.setTop(top);            
        }

        let left = this.left;          

        // NOTE: This may not work if the menu is based on a position within a scrolling 
        // div as opposed to the window that's scrolling  
        let menuHeight = Core.getHeight(this.element);             
        let windowHeight = Core.getWindowHeight();             
        let scrollYOffset = window.pageYOffset;
        let maxTop = windowHeight + scrollYOffset;

        let top = this.top;  
        if ((top + menuHeight) >= maxTop) {
            top = maxTop - menuHeight - 1;
        }

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
        this.element.style.visibility = 'visible';
        this.visible = true;
        this.mouseoverFlag = true;      
    },
    hide: function(hideParentMenu) {
        this.element.style.left = '-10000px';
        this.element.style.top = '-10000px';
        this.element.style.visibility = 'hidden';
        this.visible = false
        this.mouseoverFlag = false;

        if (hideParentMenu && this.parentMenu) {
            this.parentMenu.hide();                                        
        }

        if (this.options.hideOnMouseOut) {
            // Prevent the menu from being shown immediately after it's closed
            this.disabled = true;

            setTimeout((evt) => {
                this.disabled = false;
            }, 500);
        }

        this.onHide();
    },
    onMouseOverItem: function(item) {
        for(var i = 0; i < this.items.length; i++) {
            if (item !== this.items[i]) {
                this.items[i].cleanUp();
            }
        }        
    }
});

Core.MenuItem = Class.extend({
	_construct: function(menu, options) {
        this.menu = menu;
        this.text = options.text;
        this.subMenu = options.subMenu;    
        this.enabled = options.enabled !== undefined ? options.enabled : true;
        this.checked = options.checked;
        this.indented = options.indented;
        this.data = Object.assign({}, options.data);
        
        if (this.subMenu) {            
            this.subMenu.parentMenu = this.menu;            
        }
        
        if (this.subMenu) {
            this.defaultClass = options.defaultClass ? options.defaultClass : 'menuItemWithSubMenu';
            this.hoverClass = options.hoverClass ? options.hoverClass : 'menuItemWithSubMenuHover';
            this.disabledClass = options.disabledClass ? options.disabledClass : 'menuItemWithSubMenuDisabled';
        } else if (this.checked) {
            this.defaultClass = options.defaultClass ? options.defaultClass : 'menuItemWithCheck';
            this.hoverClass = options.hoverClass ? options.hoverClass : 'menuItemWithCheckHover';
            this.disabledClass = options.disabledClass ? options.disabledClass : 'menuItemWithCheckDisabled';            
        } else {
            this.defaultClass = options.defaultClass ? options.defaultClass : 'menuItem';
            this.hoverClass = options.hoverClass ? options.hoverClass : 'menuItemHover';
            this.disabledClass = options.disabledClass ? options.disabledClass : 'menuItemDisabled';
        }
        
		if (options.onSelect) {
			this.onSelect = options.onSelect;
		}

        this.element = document.createElement('div');
        this.element.innerHTML = options.text;
        this.element.className = this.defaultClass;

        if (!this.enabled) {
            this.element.className = this.disabledClass;
        }

        if (this.indented) {
            this.element.style.paddingLeft = '50px';
        }

        this.menu.element.appendChild(this.element);

        var self = this;

        this.element.onmouseover = function(evt) {                
            if (!self.enabled) {
                return;
            }

            self.element.className = self.hoverClass;    
            
            if (self.subMenu) {                            
                var itemLeft = Core.findLeft(self.element);               
                var itemWidth = Core.getWidth(self.element);                            
                var windowWidth = Core.getWindowWidth();
                var windowHeight = Core.getWindowHeight();                
                var subMenuWidth = Core.getWidth(self.subMenu.element);
                var subMenuHeight = Core.getHeight(self.subMenu.element);                

                var left = itemLeft + itemWidth - 1;                  
                if ((left + subMenuWidth) >= windowWidth) {
                    left = itemLeft - subMenuWidth - 1;
                }

                // NOTE: This may not work if the menu is based on a position within a scrolling 
                // div as opposed to the window that's scrolling
                var scrollYOffset = window.pageYOffset;
                var maxTop = windowHeight + scrollYOffset;
        
                var top = Core.findTop(self.element);  
                if ((top + subMenuHeight) >= maxTop) {
                    top = maxTop - subMenuHeight - 1;
                }
        
                self.subMenu.setLeft(left);                
                self.subMenu.setTop(top);                
                                            
                self.subMenu.show();            
            }
            
            self.menu.onMouseOverItem(self);                        
        }
        this.element.onmouseout = function(evt) {
            if (!self.enabled) {
                return;
            }

            self.element.className = self.defaultClass;            
            
            if (self.subMenu && !self.subMenu.mouseoverFlag) {
                self.subMenu.hide();
            }
        }
        this.element.onmousedown = function(evt) {
            self.menu.hide(true);

            if (self.enabled) {
                self.onSelect(self);
            }
            
            Core.killEvent(evt);

            return false;
        }

        return this;
    },

    onSelect: function(menuItem) {},

    show: function() {
        this.element.style.display = '';
    },
    hide: function() {
        this.element.style.display = 'none';
    },
    enable: function() {
        this.enabled = true;
        this.element.className = self.defaultClass;
    },
    disable: function() {
        this.enabled = false;
        this.element.className = self.disabledClass;
    },
    cleanUp: function() {
        if (this.subMenu) {
            this.subMenu.hide();
        }        
    }
});

Core.showMenu = function(options, items) {
    if (this.contextMenu) {
        this.contextMenu.destroy();
        this.contextMenu = null;
    }

    this.contextMenu = new Core.Menu(options);
    this.contextMenu.addItems(items);
    this.contextMenu.show();      


    return this.contextMenu;
}

Core.Popover = Class.extend({
	_construct: function(options) {
        this.id = options.id;
        this.screenCoverOpacity = options.screenCoverOpacity ? options.screenCoverOpacity : 0.5;
        this.screenCoverColor = options.screenCoverColor ? options.screenCoverColor : 'black';

        this.element = document.getElementById(options.id);

		if (!this.element) {
			this.element = document.createElement('div');
			this.element.id = options.id;
		}

        this.element.style.position = 'absolute';

		document.body.appendChild(this.element);

        this.hide();
    },
    show: function(options) {
        options = options || {};

        this.element.style.visibility = 'visible';
        this.element.style.zIndex = 105;

        if (options.center) {
            this.center();
        }

        this.createScreenCover();
    },
    hide: function() {
        this.element.style.visibility = 'hidden';

        this.destroyScreenCover();
    },
    center: function() {
        this.width = Core.getWidth(this.element);
        this.height = Core.getHeight(this.element);

        var windowWidth = Core.getWindowWidth();
        var windowHeight = Core.getWindowHeight();

        this.left = Math.floor((windowWidth - this.width) / 2);
        this.top = document.body.scrollTop + Math.floor((windowHeight - this.height) / 3);

        this.element.style.left = this.left + 'px';
        this.element.style.top = this.top + 'px';
    },
    createScreenCover: function() {
        this.screenCover = document.createElement('div');
        this.screenCover.id = 'screenCover';
        this.screenCover.style.visibility = 'visible';
        this.screenCover.style.position = 'absolute';
        this.screenCover.style.left = '0px';
        this.screenCover.style.width = '100%';
        this.screenCover.style.height = '100%';
        this.screenCover.style.zIndex = 104;
        this.screenCover.style.backgroundColor = this.screenCoverColor;
        this.screenCover.style.opacity = this.screenCoverOpacity;
        this.screenCover.style.filter = 'alpha(opacity=' + 100 * this.screenCoverOpacity + ')';
        document.body.appendChild(this.screenCover);

        this.screenCover.style.top = document.body.scrollTop + 'px';
        
        document.body.style.overflow = 'hidden';     
    },
    destroyScreenCover: function() {
        [].slice.apply(document.querySelectorAll('#screenCover')).forEach(function (cover) {
            cover.remove();
            document.body.style.overflow = null;
        })
    }
});

Core2 = {};

var __modalDialog = false;

class Dialog {
	constructor(id, options) {
        this.screenCoverOpacity = options && options.screenCoverOpacity ? options.screenCoverOpacity : 0.5;
        this.screenCoverColor = options && options.screenCoverColor ? options.screenCoverColor : 'black';

        this.element = document.getElementById(id);

		if (!this.element) {
			this.element = document.createElement('div');
			this.element.id = id;
		}

        this.element.style.position = 'absolute';

		document.body.appendChild(this.element);

        this.hide();
    }
    show(options) {
        options = options || {};

        document.body.appendChild(this.element);

        this.element.style.visibility = 'visible';
        
        this.element.style.zIndex = 105;

        if (options.center) {
            this.center();
        }

        this.createScreenCover();

        __modalDialog = true;
    }

   _show(callback) {
        this.callback = callback;

        this.init();

        this.show({ center: true });    
    }

    async showSync() {
        return new Promise((resolve, reject) => {
            this._show(result => {
                resolve(result);                
            });
        }); 
    }

    hide() {
        this.element.style.visibility = 'hidden';

        this.element.style.left = '-10000px';
        this.element.style.top = '-10000px';

        this.destroyScreenCover();

        __modalDialog = false;
    }
    center() {
        this.width = Core.getWidth(this.element);
        this.height = Core.getHeight(this.element);

        var windowWidth = Core.getWindowWidth();
        var windowHeight = Core.getWindowHeight();

        this.left = Math.floor((windowWidth - this.width) / 2);
        this.top = window.pageYOffset + Math.ceil((windowHeight - this.height) / 3) + 10;

        this.element.style.left = this.left + 'px';
        this.element.style.top = this.top + 'px';
    }

    addSelectOption(select, text, value) {
        const option = document.createElement("option");
        option.text = text;
        option.value =value;
        select.appendChild(option);
    }

    getSelectedValue(select) {
        return select.options[select.selectedIndex].value;
    }

    setSelectedValue(select, value) {
        if (value === null || value === undefined) { return; }

        for(let i = 0; i < select.options.length; i++) {
            let option = select.options[i];

            if (option.value == value.toString()) {
                select.selectedIndex = i;
            }
        }

        return select.options[select.selectedIndex].value;
    }
    
    clearSelectedValue(select) {
        for(let option of select.options) {
            option.selected = null;
        }
    }    

    parseIntValue(value) {
        if (value === '') { return null; }

        return parseInt(value);
    }    

    createScreenCover() {
        this.screenCover = document.createElement('div');
        this.screenCover.id = 'screenCover';
        this.screenCover.style.visibility = 'visible';
        this.screenCover.style.position = 'fixed';
        this.screenCover.style.left = '0px';
        this.screenCover.style.top = window.scrollY + 'px';
        this.screenCover.style.width = '100%';
        this.screenCover.style.height = '100%';
        this.screenCover.style.zIndex = 104;
        this.screenCover.style.backgroundColor = this.screenCoverColor;
        this.screenCover.style.opacity = this.screenCoverOpacity;
        this.screenCover.style.filter = 'alpha(opacity=' + 100 * this.screenCoverOpacity + ')';
        document.body.appendChild(this.screenCover);

        this.screenCover.style.top = document.body.scrollTop + 'px';
        
        document.body.style.overflow = 'hidden';     
    }
    destroyScreenCover() {
        [].slice.apply(document.querySelectorAll('#screenCover')).forEach(function (cover) {
            cover.remove();
            document.body.style.overflow = null;
        })
    }
}

Core2.Dialog = Dialog;

class DialogEx extends Core2.Dialog {
    constructor(config, data) {
        super(config.object.type + 'Dialog');

        this.config = config;
        this.data = data;

        window.addEventListener('load', this.init.bind(this));
    }

    onInit() {}
    init() {
        this.createElements();
        this.initControlValues();
        this.addEventListeners();

        this.onInit();
        this.onUpdate();
    }

    createElements() {
        this.element.className = 'dialog';
        this.element.innerHTML = '';

        const titleText = this.getTitle();
        this.dialogTitle = Core.createDiv(this.element, null, 'dialogTitle', titleText);
        this.table = Core.createTable(this.element, null);

        for(const property of this.config.properties) {
            const row = Core.createRow(this.table, this.table.rows.length);  
            Core.createCell(row, 0, null, 'fieldLabel', property.label);

            const inputCell = Core.createCell(row, 1);
            const control = this.createControl(inputCell, property);
            inputCell.appendChild(control);
            this[property.name] = control;
        }
        
        this.errorFrame = Core.createRow(this.table);        
        Core.createCell(this.errorFrame, 0);
        Core.createCell(this.errorFrame, 1, null, 'errorMessage');

        this.buttonBar = Core.createDiv(this.element, null, 'buttonBar');
        this.submitButton = Core.createElement(this.buttonBar, 'button', null, 'submitButton', 'Submit');
        this.cancelButton = Core.createElement(this.buttonBar, 'button', null, 'cancelButton', 'Cancel');
    }

    addEventListeners() {
        for(let property of this.config.properties) {
            let control = this[property.name];

            control.addEventListener('input', this.onUpdate.bind(this));
        }

        this.submitButton.onmousedown = (evt) => {
            const data = this.getData();
            const result = this.onMouseDownSubmitButton(data);

            if (result) {
                this.hide();
            }
        };

        this.cancelButton.onmousedown = (evt) => {
            this.hide();
            this.callback(false);            
        }        
    }

    createControl(parent, property) {
        switch (property.type) {
            case 'textbox': return this.creeateTextbox(parent, property);
            case 'select': return this.createSelect(parent, property);
            default: return null;
        }
    }

    creeateTextbox(parent, property) {
        let control = Core.createTextbox(parent, null, 'textBox', property.placeholder);
        if (property.maxLength) {
            control.setAttribute('maxLength', property.maxLength);
        }
        if (property.width) {
            control.style.width = property.width + 'px';
        }
        return control;
    }

    createSelect(parent, property) {
        const select = Core.createSelect(parent, null);

        this.addSelectOption(select, '-', '');  
        for(const option of property.options) {
            this.addSelectOption(select, option.text, option.value);
        }  

        return select;
    }

    getTitle() {
        if (this.config.header && this.config.header.title) {
            let title = this.config.header.title;
            return this.data ? title.edit : title.create;                        
        } else {
            const objectName = this.getFormattedObjectName();
            return this.data ? `Edit ${objectName}`: `Create ${objectName}`;
        }
    }

    getFormattedObjectName() {
        let name = this.config.object.alias ? this.config.object.alias : this.config.object.type;
        name = this.capitalizeFirstLetter(name);
        name = this.separateWords(name);
        return name;
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    decapitalizeFirstLetter(str) {
        return str.charAt(0).toLowwerCase() + str.slice(1);
    }
    
    separateWords(str) {
        return str.replace(/([A-Z])/g, ' $1').trim();
    }

    initControlValues() {  
        for(const property of this.config.properties) {
            this.initControlValue(property);
        }
    }

    initControlValue(property) {
        switch (property.type) {
            case 'textbox': this.initTextboxValue(property); break;
            case 'select': this.initSelectValue(property); break;                
        }
    }

    initTextboxValue(property) {
        const value = this.data ? this.data[property.name] : '';
        const control = this[property.name];
        control.value = value === null || value === undefined ? '' : value;
    }  

    initSelectValue(property) {
        const value = this.data ? this.data[property.name + 'Id'] : null;        
        const select = this[property.name];
        this.setSelectedValue(select, value); 
    }

    getControlValue(property) {
        switch (property.type) {
            case 'textbox': return this.getTextboxValue(property);
            case 'select': return this.getSelectValue(property);             
            default: return null;
        }
    }  

    getTextboxValue(property) {
        const textbox = this[property.name];        
        const str = textbox.value.trim();

        return this.parsePropertyValue(property, str);
    }

    getSelectValue(property) {
        const select = this[property.name];        
        const str = this.getSelectedValue(select);

        return this.parsePropertyValue(property, str);        
    }

    parsePropertyValue(property, value) {
        switch (property.type) {
            case 'integer': return this.parseInt(str);
            case 'floar': return this.parseFloat(str);    
            default: return value;        
        }
    }    

    getData() {
        const data = {
            id: this.data ? this.data.id : undefined
        };

        for(const property of this.config.properties) {
            if (property.type === 'select') {
                data[property.name + 'Id'] = this.getControlValue(property);
            } else {
                data[property.name] = this.getControlValue(property);
            }
        }

        return data; 
    } 

    onUpdate() {
        const data = this.getData();    
        const isValid = this.validate(data);

        if (isValid) {
            this.enableSubmitButton();
        } else {
            this.diableSubmitButton();
        }
    }

    getElement(scopedId) {
        const elementId = this.element.id + '-' + scopedId;
        const element = $(elementId); 
        return element;
    }

    async onMouseDownSubmitButton() {
        if (this.submitButton.disabled) { return; }

        //this.hideErrorMessage();
        this.diableSubmitButton();

        let data = this.getData();    

        if (!this.validate(data)) {   
            this.enableSubmitButton();
        } else {
            const response = await APISync.saveObject(this.config.object.path, data);

            if (response.error) {
                this.showErrorMessage(response.error);
                this.enableSubmitButton();
            } else {
                this[this.config.object.type + 'Id'] = response.data.id;

                this.hide();
                this.callback(response.result);
            }
        }
    } 

    enableSubmitButton() {
        this.submitButton.disabled = false;
        this.submitButton.classList.remove('disabled');
        this.submitButton.innerHTML = 'Submit';
    }

    diableSubmitButton() {
        this.submitButton.disabled = true;
        this.submitButton.classList.add('disabled');
        this.submitButton.innerHTML = 'Submit';
    }

    validate(data) {
        let valid = true;

        this.resetErrors();

        for(const property of this.config.properties) {
            let value = property.type === 'select' ? data[property.name + 'Id'] : data[property.name];

            if (!this.validatePropertyValue(property, value)) {
                //this.showInputError(property.name);
                valid = false;
            }
        }   

        return valid;
    }  

    validatePropertyValue(property, value) {
        switch (property.type) {
            case 'textbox': return this.validateTextBoxValue(property, value);
            case 'select': return this.validateSelectValue(property, value);
        }
    }

    validateTextBoxValue(property, value) {
        if (property.required && value === '') {
            return false;
        }
        if (property.minLength && this.isString(value) && value.length < property.minLength) {
            return false;
        }

        return true;
    }

    validateSelectValue(property, value) {
        if (property.required) {
            if (value === '') return false;
            if (value === undefined) return false;
            if (value === null) return false;
        }
        return true;
    }

    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    sluggify(str) {
        return str
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '');          
    }

    resetErrors() {
        //this.hideInputError(this.firstNameInput);
        //this.hideInputError(this.lastNameInput);
    } 

    showInputError(input) {
        input.classList.add('invalid');
    }

    hideInputError(input) {
        input.classList.remove('invalid');
    }    

    showErrorMessage(errorMessage) {
        this.errorMessageFrame.style.display = '';
        this.errorMessage.innerHTML = errorMessage;
    }

    hideErrorMessage() {
        this.errorMessageFrame.style.display = 'none';
        this.errorMessage.innerHTML = '';
    }
}

Core2.DialogEx = DialogEx;

class Tooltip {
    constructor(target, text) {
        this.target = target;

		this.element = document.createElement('span');
		this.element.className = 'tooltip';
        this.element.innerHTML = text;
        document.body.appendChild(this.element);
       
        let targetLeft = Core.findLeft(this.target);
        let targetTop = Core.findTop(this.target)
        let elementHeight = Core.getHeight(this.element);

        let left = targetLeft;
        let top = targetTop - elementHeight - 7;

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }
    hide() {
        Core.removeElement(this.element);
    }
}

Core2.Tooltip = Tooltip;
