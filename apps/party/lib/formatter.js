const pluralize = require('pluralize')

class Formatter {
    static formatAsTitle(str) {
        let temp = str.replace(/([A-Z])/g, " $1");
        temp = result.charAt(0).toUpperCase() + temp.slice(1);

        return temp;
    }

    static formatAsTitlePlural(str) {
        let temp = str.replace(/([A-Z])/g, " $1");
        temp = temp.charAt(0).toUpperCase() + temp.slice(1);
        temp = pluralize(temp);

        return temp;
    }

    static formatAsPath(str) {
        let temp = str.replace(/([A-Z])/g, "-$1");
        temp = temp.toLowerCase();

        return temp;
    }

    static formatAsPathPlural(str) {
        let temp = str.replace(/([A-Z])/g, "-$1");
        temp = temp.toLowerCase();
        temp = pluralize(temp);

        return temp;
    }

    static formatAsPlural(str) {
        return pluralize(str);
    }
}

module.exports = Formatter;