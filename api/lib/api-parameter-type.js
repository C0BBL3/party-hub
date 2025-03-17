class APIParameterType {
    constructor() { }
    
    isInteger(str) {
        return !isNaN(str) && Number.isInteger(parseFloat(str));
    }

    isStr(str) {
        return typeof str === 'string' && !this.isInteger(str);
    }

    isDate(str) { // in form of YYYY-MM-DD
        const validStr = this.isStr(str);
        if (!validStr) { return; }
    
        const splitStr = str.split('-');
        const splitStrLengths = splitStr.map(e => e.length);
        const splitStrIsInts = splitStr.map(e => this.isInteger(e));
        return str.length === 10 && splitStr.length == 3 && this.areArraysEqual(splitStrLengths, [4, 2, 2]) && this.areArraysEqual(splitStrIsInts, [true, true, true]);
    }

    isEmail(str) {
        if (!this.isStr(str)) {
            return false;
        }
    
        const email_re = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/g;
        const match_ = email_re.exec(str);

        if (match_ == null) { return false; }
    
        const matchCode =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        return match_[0].match(matchCode);
    }
}

module.exports = APIParameterType;