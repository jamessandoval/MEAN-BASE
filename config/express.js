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
  passport = require('passport'),
  logger = require('morgan'),
  path = require('path');

// Angular REST ROUTES
var api_results = require('../app/routes/api_results');
var api_file_data = require('../app/routes/api_file_data');

// Define the Express configuration method
module.exports = function() {

  // Create a new Express application instance
  var app = express();

    // Use the 'body-parser' and 'method-override' middleware functions
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(bodyParser.json());

  // Morgan plugin
  app.use(logger('dev'));

  // Configure static file serving
  app.use(express.static('./public'));

  // Angular Addition
  app.use(express.static(path.join(__dirname, '../dist')));

  // Results Paths
  app.use('/results', express.static(path.join(__dirname, '../dist')));


  
  // Express Routing Routes
  app.use('/result', api_results);



  app.use('/result/:template/:language/:result', api_results);

  app.use('/files', api_file_data);

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

  //
  // Error Handling -> 404, 500, & All Errors
  // 
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ?
      err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error',{
      title: 'Default Error Page',
    });
  });

  // Load the routing files

  //require('express-load-routes')(app, '../app/routes');

  //require('../app/routes/index.server.routes.js')(app);
  //require('../app/routes/dashboard.server.routes.js')(app);
  //require('../app/routes/results.server.routes.js')(app);

  // Return the Express application instance
  return app;
};
