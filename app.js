#!/usr/bin/env node
/*
Sets up and runs the PartyHub app
Author Colby Roberts
*/
const fs = require("fs");
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const expressLayouts = require('express-layouts');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const errorHandler = require('errorhandler');
const compression = require('compression');
const db = require('./utils/database');

let request;

global.__base = __dirname;
global.nodeEnv = process.env.NODE_ENV || 'development';

let config = require('./config/' + nodeEnv);
process.title = 'party hub';

// // Create a temp diretory if one doesn't already exist
// if (!fs.existsSync(config.temp.dir)) {
//     fs.mkdirSync(config.temp.dir, { recursive: true });
// }

db.onError((error) => {
    console.error('Database Error');
    console.log(error);
});

db.connect(config.database);

const app = express()
initApp(app);

console.log('Starting the server...');

function initApp(app) {
    app.use(compression());

    var server = http.createServer(app).listen(config.http.port);
    
    // if (nodeEnv == 'production') {
    //     var options = {
    //         key: fs.readFileSync('/root/server.key'),
    //         cert: fs.readFileSync('/root/server.crt'),
    //         ca: fs.readFileSync('/root/intermediate.crt'),
    //         requestCert: true,
    //         rejectUnauthorized: false
    //     };
    
    //     var sslServer = https.createServer(options, app).listen(443);
    
    //     app.use(function (req, res, next) {
    //         if (req.connection.encrypted) {
    //             // Already https - don't do anything special
    //             next();
    //         } else {
    //             // Redirect to https
    //             res.redirect('https://' + req.headers.host + req.url);
    //         }
    //     });
    // }
    
    app.use(methodOverride());
    app.use(bodyParser.json({
        limit: '50mb'
    }));
      
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        parameterLimit: 100000,
        extended: true 
    }));
    app.use(cookieParser("thissecretrocks"));
    app.use(cookieSession({
        name: 'session',
        keys: ['1234567890'],
    
        // Cookie Options
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }));

    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use((req, res, next)=>{
        request = req;
        next();
    });

    app.use(expressLayouts);

    app.set('view engine', 'ejs');

    const apiRoutes = require(`./api/routes.js`);
    app.use(apiRoutes);

    let screens = ['main', 'host', 'login', 'map', 'party', 'settings'];

    let viewDirectories = [ path.join(__dirname, 'public') ];

    for (let screen of screens) { 
        const baseRoute = `./apps/${screen}`;
        const publicRoute = `${baseRoute}/public/`;
        const viewDirectory = path.join(__dirname, publicRoute);

        viewDirectories.push(viewDirectory);
        app.use(express.static(viewDirectory));

        const routes = require(`${baseRoute}/routes/index.js`);
        routes.register(app);
    }

    app.set('views', viewDirectories);

    app.set('layout', 'layout/layout'); // defaults to 'layout'

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception');
        console.log(error);
    });
    
    process.on('unhandledRejection', (error) => {
        console.error('Uncaught Rejection');
        console.log(error);
    });
}