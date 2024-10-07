
/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/blog/simple-javascript-inheritance/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
(function(){
var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
// The base Class implementation (does nothing)
this.Class = function(){};

// Create a new Class that inherits from this class
Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the initialize constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
    // Check if we're overwriting an existing function
    prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
        return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
        };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
    // All construction is actually done in the initialize method
    if (!initializing && this._construct)
        this._construct.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
};
})();

function $(id) {
    return document.getElementById(id);
}

Core = {
    ////////////////////////////////////////////////////////////////////////////
    // General

    getQueryStringValue: function(key) {  
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
    },    

    isObject: function(obj) {
        return (typeof(src) == 'object');
    },
    equivalent: function(src1, src2) {
        if (src1 == src2) return true;
        if (src1 == null || src2 == null) return false;
        if (typeof(src1) != typeof(src2)) return false;

        if (typeof(src1) != 'object') {
            return (src1 == src2);
        } else {
            for(i in src1) {
                if (!equivalent(src1[i], src2[i])) {
                    return false;
                }
            }
            for(i in src2) {
                if (src1[i] == undefined) {
                    return false;
                }
            }
        }

        return true;
    },
    copy: function(src) {
        if (src == null || typeof(src) != 'object') {
            return src;
        }

        var c = {};
        for(var i in src) {
            c[i] = copy(src[i]);
        }

        return c;
    },

    navigate: function(url) {
        window.location.href = url;
    },
  
    parseJSON: function(json) {
        let result;

        try {
            result = JSON.parse(json);
        } catch (error) {
            result = null;
        }

        return result;
    },

    ////////////////////////////////////////////////////////////////////////////
    // DOM
    elt: function(id) {
        return document.getElementById(id);
    },
    
    elts: function(className) {
        return document.getElementsByClassName(className);
    },    

    createDiv: function(parent, id, className, innerHTML) {
        return this.createElement(parent, 'div', id, className, innerHTML, parent);
    },

    createSpan: function(parent, id, className, innerHTML) {
        return this.createElement(parent, 'span', id, className, innerHTML, parent);
    },    

    createImg: function(parent, id, className, src) {
        let elt = document.createElement('img');
        if (parent) { parent.appendChild(elt); }

        if (id) { elt.id = id; }
        if (className) { elt.className = className; } 
        if (src) { elt.src = src; }

        return elt;
    },    

    createAnchor: function(parent, id, className, innerHTML, href) {
        let elt = document.createElement('a');
        if (parent) { parent.appendChild(elt); }

        if (id) { elt.id = id; }
        if (className) { elt.className = className; } 
        if (innerHTML) { elt.innerHTML = innerHTML; }
        if (href) { elt.href = href; }

        return elt;
    },

    createTable: function(parent, id, className) {
        let elt = document.createElement('table');
        if (parent) { parent.appendChild(elt); }

        if (id) { elt.id = id; }
        if (className) { elt.className = className; }        

        return elt;        
    },

    createRow: function(table, index, id, className) {
        let row = table.insertRow(index);

        if (id) { row.id = id; }
        if (className) { row.className = className; }

        return row;
    },

    createCell: function(row, index, id, className, innerHTML) {
        let cell;

        if (index !== null && index !== undefined && index >= 0) {
            cell = row.insertCell(index);
        } else {
            cell = row.insertCell();
        }

        if (id) { cell.id = id; }
        if (className) { cell.className = className; }
        if (innerHTML) { cell.innerHTML = innerHTML; }

        return cell;
    },

    createText: function(parent, text) {
        let elt = document.createTextNode(text);
        if (parent) { parent.appendChild(elt); }

        return elt;
    }, 

    createTextbox: function(parent, id, className, placeholder) {
        let elt = this.createElement(parent, 'input', id, className);
        if (placeholder) {
            elt.setAttribute('placeholder', placeholder);
        }
        elt.setAttribute('autocomplete', 'off');
        return elt;
    },

    createSelect: function(parent, id, className) {
        let elt = this.createElement(parent, 'select', id, className);
        return elt;
    },
  
    insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);        
    },

    createElement: function(parent, type, id, className, innerHTML) {
        let elt = document.createElement(type);
        if (parent) { parent.appendChild(elt); }

        if (id) { elt.id = id; }
        if (className) { elt.className = className; }
        if (innerHTML) { elt.innerHTML = innerHTML; }

        return elt;
    },

    removeElement: function(element) {
        if (element) {
            if (typeof element === 'string') {
                element = Core.elt(element);
            }

            for(var i = (element.childNodes.length - 1); i >= 0; i--) {
                Core.removeElement(element.childNodes[i]);
            }

            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    },
    removeChildNodes: function(element) {
        if (element) {
            for(var i = (element.childNodes.length - 1); i >= 0; i--) {
                Core.removeElement(element.childNodes[i]);
            }
        }
    },    
    getChildNodes(parent, childClass) {
        let childNodes= [];
        for(let child of parent.childNodes) {
            if (child.classList && child.classList.contains(childClass)) {
                childNodes.push(child);
            }
        }

        return childNodes;
    },
    attachEventHandler: function(id, eventType, eventHandler) {
        let elt = document.getElementById(id);       
        elt.addEventListener(eventType, eventHandler, false);  
    },

    attachEventHandlers: function(className, eventType, eventHandler) {
        let elts = document.getElementsByClassName(className);       
        for(let elt of elts) {
            elt.addEventListener(eventType, eventHandler, false);
        }        
    },

    findEventSource: function(event, className) {
        let target = event.target;
        while (!target.classList.contains(className)) {
            target = target.parentNode;
        }
        return target;
    },

    getComputedStyle: function(elt, styleName) {
        if (elt.currentStyle) {
            return elt.currentStyle[styleName];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(elt, null).getPropertyValue(styleName);
        }
        return '';
    },

    getWindowWidth: function() {
        return (window.innerWidth ? window.innerWidth : document.body.clientWidth);
    },
    getWindowHeight: function() {
        return (window.innerHeight ? window.innerHeight : document.body.clientHeight);
    },
    getWidth: function(elt) {
        if (elt === document.body) return this.getWindowWidth();

        var width = elt.offsetWidth ? elt.offsetWidth : elt.style.pixelWidth;

        if (width <= 0) {
            width = parseInt(elt.style.width);
            if (isNaN(width)) { width = 0; }
        }

        return width;
    },
    getHeight: function(elt) {
        if (elt === document.body) return this.getWindowHeight();

        var height = elt.offsetHeight ? elt.offsetHeight : elt.style.pixelHeight;

        if (height <= 0) {
            height = parseInt(elt.style.height);
            if (isNaN(height)) { height = 0; }
        }

        return height;
    },
    getContentWidth: function(elt) {
        return elt.scrollWidth;
    },
    getContentHeight: function(elt) {
        return elt.scrollHeight;
    },
    getLeft: function(elt) {
        if (elt === document.body) return 0;
        return (typeof elt.offsetLeft != 'undefined' ? elt.offsetLeft : elt.style.pixelLeft);
    },
    getRight: function(elt) {
        if (elt === document.body) return this.getWindowWidth();
        return this.getLeft(elt) + this.getWidth(elt);
    },
    getTop: function(elt) {
        if (elt === document.body) return 0;
        return (typeof elt.offsetTop != 'undefined' ? elt.offsetTop : elt.style.pixelTop);
    },
    getBottom: function(elt) {
        if (elt === document.body) return this.getWindowHeight();
        return this.getTop(elt) + this.getHeight(elt);
    },
    findLeft: function(elt, container) {
        var left = 0;
        if (elt.offsetParent) {
            while(elt.offsetParent && elt !== container) {
                left += elt.offsetLeft;
                elt = elt.offsetParent;
            }
        } else if (elt.x) {
            left += elt.x;
        }

        return left;
    },
    findTop: function(elt, container) {
        var top = 0;
        if (elt.offsetParent) {
            while (elt.offsetParent && elt !== container) {
                top += elt.offsetTop;
                elt = elt.offsetParent;
            }
        } else if (elt.y) {
            top += elt.y;
        }

        return top;
    },
    getScrollLeft: function() {
        return scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    },    
    getScrollTop: function() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    setScrollLeft: function(scrollLeft) {
        document.documentElement.scrollLeft = document.body.scrollLeft = scrollLeft;
    },
    setScrollTop: function(scrollTop) {
        document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
    },   
    
    disableScrolling: function () {
        if (document.body.style.overflow !== 'hidden') {
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            document.documentElement.scrollTop = document.body.scrollTop = '0px';
            document.body.style.overflow = 'hidden';

            this.disabledScrolling = true;
        }
    },    
    
    enableScrolling: function() {
        if (this.disabledScrolling) {
            document.body.style.overflow = '';
            window.scrollTo(0, this.scrollTop);
        }
    },     

    disableTextSelect: function(elt) {        
        elt.style['-webkit-touch-callout'] = 'none';
        elt.style['-webkit-user-select'] = 'none';
        elt.style['-khtml-user-select'] = 'none';
        elt.style['-moz-user-select'] = 'none';
        elt.style['-ms-user-select'] = 'none';
        elt.style['user-select'] = 'none';   
    },
    enableTextSelect: function(elt) {       
        elt.style['-webkit-touch-callout'] = null;
        elt.style['-webkit-user-select'] = null;
        elt.style['-khtml-user-select'] = null;
        elt.style['-moz-user-select'] = null;
        elt.style['-ms-user-select'] = null;
        elt.style['user-select'] = null;
    },
    removeSelectionRanges: function() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }        
    },
    getSelectedOption: function(elt) {
        return elt.options[elt.selectedIndex];
    },

    getRadioButtonValue: function(name) {
        let radioButtons = document.getElementsByName(name);

        for(let radioButton of radioButtons) {
            if (radioButton.checked) {
                return radioButton.value;                
            }
        }        
        return null;
    },

    ////////////////////////////////////////////////////////////////////////////
    // Events
    getEventSource: function(evt) {
        return evt.target ? evt.target : (evt.srcElement ? evt.srcElement : null);
    },

    getElementMousePosition(evt) {
        let rect = evt.target.getBoundingClientRect();

        return {
            x: evt.clientX - rect.left, 
            y: evt.clientY - rect.top  
        }
    },
  
    getKeyCode: function(evt) {
        if (evt.keyCode) { return evt.keyCode; }
        else if (evt.charCode) { return evt.charCode; }
        else { return null; }
    },

    killEvent: function(evt) {
        this.cancelPropagation(evt);
        this.preventDefault(evt);
    },

    cancelPropagation: function(evt) {
        if (window.event) {
            window.event.cancelBubble = true;
        } else if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        }
    },
    preventDefault: function(evt) {
        if (window.event) {
            window.event.returnValue = false;
        } else if (evt && evt.preventDefault) {
            evt.preventDefault();
        }
    },
  
    ////////////////////////////////////////////////////////////////////////////
    // AJAX
    get: function(url, callback) {
        this.ajax = this.ajax || new Core.Ajax();
        this.ajax.send('GET', url, null, callback);
    },
    post: function(url, data, callback) {
        this.ajax = this.ajax || new Core.Ajax();
        this.ajax.send('POST', url, data, callback);
    },

    ////////////////////////////////////////////////////////////////////////////
    // Strings
    trim: function(str) {
        if (str) {
            return str.replace(/^\s*|\s*$/g, '');
        } else {
            return '';
        }
    },
    trimLeft: function(str) {
        return str.replace(/^\s*/, '');
    },
    trimRight: function(str) {
        return str.replace(/\s*$/, '');
    },
    stripTags: function(str) {
        var regExp = /<\/?[^>]+>/gi;
        str = str.replace(regExp, '');
        return str;
    },
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    ucwords: function(str) {
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    },
    titleCase: function(str) {
        str = Core.ucwords(str);

        var title = (str + ' ').replace(/\s(A|An|And|At|For|In|Of|On|Or|The|To|With)\s/g, function ($1) {
            return $1.toLowerCase();
        });

        // Remove final space
        return title.substr(0, title.length-1);
    },
    startsWith: function(str, prefix) {
        return (str.substr(0, prefix.length) == prefix);
    },
    endsWith: function(str, suffix) {
        return (str.substr(str.length - suffix.length) == suffix);
    },
    isLetter: function(str) {
        return (str >= 'a' && str <= 'z\uffff') || (str >= 'A' && str <= 'Z\uffff');
    },
    isDigit: function(str) {
        return (str >= '0' && str <= '9');
    },
    leftOf: function(haystack, needle) {
        var pos = haystack.indexOf(needle);
        return (pos >= 0 ? haystack.substr(0, pos) : '');
    },
    rightOf: function(haystack, needle) {
        var pos = haystack.indexOf(needle);
        var len = haystack.length;
        return (pos > 0 ? haystack.substr(pos + len) : '');
    },
    insert: function(str1, index, str2) {
        var left = str1.leftOf(index);
        var right = str1.rightOf(index);

        return left + str2 + right;
    },
  
    ////////////////////////////////////////////////////////////////////////////
    // Misc
    generateGUID: function() {
        var S4 = function() {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };

        return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
    },

    decodeQueryString: function() {
        var pairs = location.search.slice(1).split('&');
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return JSON.parse(JSON.stringify(result));
    }    
};

////////////////////////////////////////////////////////////////////////////////
// Ajax
Core.Ajax = Class.extend({
    _construct: function() {
        this.xhr = this.createXHR();
        this.requestQueue = [];
        this.requestTimeout = 20000;
    },
    createXHR: function() {
        var xhr;

        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        return xhr;
    },
    send: function(method, url, data, callback) {
        var request = {
            method: method,
            url: url,
            data: data,
            callback: callback
        };

        this.requestQueue.push(request);

        if (!this.xhr.readyState || this.xhr.readyState == 4) { // Uninitialized or Complete
            this.processNextRequest();
        }
    },
    processNextRequest: function() {
        try {
            if (this.requestQueue.length > 0) {
                var request = this.requestQueue[0];

                if (request.isProcessing) { return; }

                request.isProcessing = true;

                if (request.method == 'GET') {
                    this.xhr.open('GET', request.url, true);

                    this.xhr.onloadend = () => {
                        if (this.xhr.status === 404) {
                            request.callback({
                                type: 'SessionTimeout',
                                message: "Oops, it looks like your session may have timed out. Please log back into to resume."
                            }, null);
                        }
                    }

                    this.xhr.onreadystatechange = this.processStateChange.bind(this);
                    this.xhr.send(null);

                } else if (request.method == 'POST') {
                    this.xhr.open('POST', request.url, true);

                    this.xhr.onloadend = () => {
                        if (this.xhr.status === 404) {
                            request.callback({
                                type: 'SessionTimeout',
                                message: "Oops, it looks like your session may have timed out. Please log back in to resume."
                            }, null);
                        }
                    }

                    this.xhr.onreadystatechange = this.processStateChange.bind(this);

                    if (typeof(request.data) == 'object') {
                        this.xhr.setRequestHeader("Content-Type", "application/json");
                        this.xhr.send(JSON.stringify(request.data));
                    } else {
                        this.xhr.send(request.data);
                    }
                }
                
                //this.timerID = setTimeout(function() {
                //    request.callback("Request timed out.", null);
                //}, this.requestTimeout);
            }
        } catch(e) {
            setTimeout(this.processNextRequest.bind(this), 10);
        }
    },
    processStateChange: function() {
        if (this.xhr.readyState == 4) { // Complete
            if (this.xhr.status == 200) {

                if (this.timerID) {
                    clearTimeout(this.timerID);
                    delete this.timerID;
                }

                var request = this.requestQueue[0];

                if (request.callback != null) {
                    var responseText = Core.trim(this.xhr.responseText);

                    var response = eval('(' + responseText + ')');
                    request.callback(null, response);
                }

                this.requestQueue.shift();

                // Avoid memory leak in MSIE: clean up the onComplete event handler
                this.xhr.onreadystatechange = function() {};

                // Must not reenter Ajax. Schedule next request in 10ms
                setTimeout(this.processNextRequest.bind(this), 10);

            } else {
                var request = this.requestQueue[0];
                request.callback({
                    type: 'ConnectionError',
                    message: "Oops, it looks like there was a network error. Please check your internet connection."
                }, null);

                this.requestQueue.shift();

                setTimeout(this.processNextRequest.bind(this), 10);
            }
        }
    }
});

////////////////////////////////////////////////////////////////////////////////
// Random
Core.Random = {
    getReal: function(low, high) {
        return low + Math.random() * Math.abs(high - low);
    },
    getInteger: function(low, high) {
        return Math.floor(low + Math.random() * (high - low + 1));
    },
    getNormal: function() {
        // Numerical Recipes (Section 7.2)
        this.iset = 0;
        this.gset = 0;

        var fac, r, v1, v2;

        if (this.iset == 0) {
            do {
                v1 = 2.0 * Math.random() - 1.0;
                v2 = 2.0 * Math.random() - 1.0;

                r = v1 * v1 + v2 * v2;
            } while (r >= 1.0 || r == 0);

            fac = Math.sqrt(-2.0 * Math.log(r) / r);
            this.gset = v1 * fac;
            this.iset = 1;

            return v2 * fac;
        } else {
            this.iset = 0;
            return this.gset;
        }
    }
};

////////////////////////////////////////////////////////////////////////////////
// Cookie
Core.Cookie = {
    setValue: function(name, value, options) {
        var storedValue = escape(value);

        if (options) {
            if (options.expires) {
                // Expires is in days
                var exDate = new Date();
                exDate.setDate(exDate.getDate() + options.expires);

                storedValue += ';expires=' + exDate.toUTCString();
            }
            if (options.path) {
                storedValue += ';path=' + options.path;
            }
            if (options.domain) {
                storedValue += ';domain=' + options.domain;
            }
            if (options.secure) {
                storedValue += ';secure';
            }
        }

        document.cookie = name + '=' + storedValue;
    },
    setObject: function(name, object, options) {
        try {
            var value = JSON.stringify(object);
            this.setValue(name, value);
        } catch(e) {}
    },
    getValue: function(lookupName) {
        var cookies = document.cookie.split(';');

        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var p = cookie.indexOf('=');
            var name = cookie.substr(0, p);
            var value = cookie.substr(p + 1);

            name = name.replace(/^\s+|\s+$/g, '');

            if (name == lookupName) {
                return unescape(value);
            }
        }

        return null;
    },
    getObject: function(name) {
        try {
            var value = this.getValue(name);

            return JSON.parse(value);
        } catch(e) {
            return null;
        }
    },
    remove: function(name) {
        this.setValue(name, '', -1);
    }
};