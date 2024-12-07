/*
Creates the routes to the Feed, Friends, and RSVP screens
Author Colby Roberts
*/
const fs = require('fs');
const path = require('path');
const Formatter = require('../lib/formatter');

const categories = ['feed', 'friends', 'join', 'rsvp'];

module.exports.register = (app) => {
    addCategoryRoutes(app, categories);
}

function addCategoryRoutes(app, categories) {
    for(const name of categories) {
        const filename = Formatter.formatAsPath(name);

        useRoutesIfExists(app, `./views/${filename}.js`);
        useRoutesIfExists(app, `./api/${filename}.js`);
    }
}

function useRoutesIfExists(app, filename) {
    const pathname = path.join(__dirname, filename);
    if (fs.existsSync(pathname)) {
        app.use(require(pathname));
    } 
}
