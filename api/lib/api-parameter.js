const lodash = require('lodash');
const moment = require('moment');

class APIParameter {
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

    isDay(day) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; 
        return days.includes(day.toLowerCase());
    }

    isTime(time) {
        const [timeString, period] = time.split(" ");
        let [hour, minute] = timeString.split(":").map(Number);
        return ["AM", "PM"].includes(period) && hour !== NaN && minute !== NaN;
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

    isTimeFrameOrdered(startDate, endDate) {
        const localOffset = new Date().getTimezoneOffset() * 60; // seconds offset in unix time
        const endOfDayTime = 86399; // 11:59:59.999 PM in seconds from 00:00:00

        const parameter = new APIParameter();

        const startDateUNIX = parameter.processDateToUNIXTimestamp(startDate) - localOffset;
        const endDateUNIX = parameter.processDateToUNIXTimestamp(endDate) - localOffset + endOfDayTime;

        return startDateUNIX < endDateUNIX;
    }

    deduceUserIdentificationType(argument) {
        if (this.isInteger(argument)) { // if argument is a integer
            return 'id';
        }

        if (this.isEmail(argument)) { // if argument is an email
            return 'email';
        }

        if (this.isStr(argument)) { // if argument is a username
            return 'username'
        }

        return null; // otherwise its invalid
    }

    areArraysEqual(arr1, arr2) {
        return lodash.isEqual(arr1, arr2); // lodash ftw
    }

    processTimestamp(timestamp, offset = 0) { // offset must be in seconds because unix timestamp
        return timestamp ? new Date(moment.utc(timestamp).valueOf() - (offset * 1000)) : null;
    }

    processTimestampSQL(timestamp) {
        return timestamp ? moment.utc(timestamp).format("YYYY-MM-DD HH:mm:ss") : null;
    }

    processDate(date) { // get date object with zero'd out time in the form YYYY-MM-DD
        return date ? moment.utc(date).format('YYYY-MM-DD') : null;
    }
    
    processUNIXTimestamp(UNIXTimestamp) { // UNIX MS to UNIX S
        return this.isInteger(UNIXTimestamp) ? +Math.floor((+UNIXTimestamp) / 1000).toFixed(0) : null;
    }
    
    processTimestampToUNIXTimestamp(timestamp) { // timestamp -> Date -> UNIX MS -> UNIX S
        return timestamp ? this.processUNIXTimestamp(moment.utc(timestamp).valueOf()) : null;
    }

    processDateToUNIXTimestamp(date) {
        return date ? this.processUNIXTimestamp(moment.utc(date).valueOf()) : null;
    }

    processUNIXTimestampToDate(UNIXTimestamp) { // js date is Unix MS not Unix S so multiply by 1000 to get UNIX MS
        return this.isInteger(UNIXTimestamp) ? this.processDate((+UNIXTimestamp) * 1000) : null; 
    }
}

module.exports = APIParameter;