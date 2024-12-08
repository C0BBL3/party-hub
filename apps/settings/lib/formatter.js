/*
Creates the Formatter class for formatting text
Author: Colby Roberts
*/
const pluralize = require('pluralize'); // Importing the pluralize library to handle pluralization

class Formatter {
    // Formats a string as a title (capitalizes the first letter of each word)
    static formatAsTitle(str) {
        let temp = str.replace(/([A-Z])/g, " $1"); // Adds spaces before uppercase letters
        temp = temp.charAt(0).toUpperCase() + temp.slice(1); // Capitalizes the first character

        return temp; // Returns the formatted string as a title
    }

    // Formats a string as a plural title (capitalizes the first letter and pluralizes the string)
    static formatAsTitlePlural(str) {
        let temp = str.replace(/([A-Z])/g, " $1"); // Adds spaces before uppercase letters
        temp = temp.charAt(0).toUpperCase() + temp.slice(1); // Capitalizes the first character
        temp = pluralize(temp); // Pluralizes the string using the pluralize library

        return temp; // Returns the formatted plural title
    }

    // Formats a string as a path (converts to lowercase and separates words with hyphens)
    static formatAsPath(str) {
        let temp = str.replace(/([A-Z])/g, "-$1"); // Adds hyphens before uppercase letters
        temp = temp.toLowerCase(); // Converts the entire string to lowercase

        return temp; // Returns the formatted string as a path
    }

    // Formats a string as a plural path (converts to lowercase, adds hyphens, and pluralizes)
    static formatAsPathPlural(str) {
        let temp = str.replace(/([A-Z])/g, "-$1"); // Adds hyphens before uppercase letters
        temp = temp.toLowerCase(); // Converts the entire string to lowercase
        temp = pluralize(temp); // Pluralizes the string

        return temp; // Returns the formatted plural path
    }

    // Formats a string as a plural (using the pluralize library)
    static formatAsPlural(str) {
        return pluralize(str); // Returns the plural form of the string
    }
}

module.exports = Formatter; // Export the Formatter class for use in other parts of the application
