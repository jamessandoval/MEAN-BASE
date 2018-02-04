// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
    express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');


// Define the Express configuration method
module.exports = function() {
    // Create a new Express application instance
    var app = express();

    // Configure static file serving
    app.use(express.static('./public'));

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Configure the 'session' middleware
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // Configure the flash messages middleware
    app.use(flash());

    // Configure the Passport middleware
    //app.use(passport.initialize());
    //app.use(passport.session());


    // Load the routing files

    //require('express-load-routes')(app, '../app/routes');

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/dashboard.server.routes.js')(app);
    require('../app/routes/results.server.routes.js')(app);

    // Return the Express application instance
    return app;
};