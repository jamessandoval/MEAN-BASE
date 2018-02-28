// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
const config = require('./config'),
  express = require('express'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  flash = require('connect-flash'),
  passport = require('passport'),
  logger = require('morgan'),
  path = require('path');

//  Main Site Routes
const api_results = require('../app/routes/api_results');
const api_file_data = require('../app/routes/api_file_data');
const language = require('../app/routes/language');
const main = require('../app/routes/main');
const output = require('../app/routes/output');
const api_dashboard = require('../app/routes/api_dashboard');

// Angular App Routes
const angular_results = require('../app/routes/angular_results')

// Define the Express configuration method
module.exports = function() {

  // Create a new Express application instance
  var app = express();

  // Configure the socket stream for the web socket.
  // Use the 'body-parser' and 'method-override' middleware functions
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(bodyParser.json());

  // Morgan plugin
  app.use(logger('dev'));


  // Example of Angular Path
  // --> app.use('/results_angular', express.static(path.join(__dirname, '../dist')));

  //
  // Begin Restructuring Routes to use middleware
  //

  // <-- Angular Rest Routes Begin Here -->

  // All files include
   // app.get('/', )

  app.get('/angular-results', angular_results.all)

  // <-- Angular Rest Routes End Here --> 

  app.get('/', api_dashboard.render);

  // Test Results Paths
  app.get('/results', api_results.getResults);
  app.get('/results/:template/:locale', api_results.getResultByIdAndLanguage);

  // get Result Counts
  app.get('/result-count', api_results.getTotalResultCount);

  app.get('/result-by-feature', api_dashboard.getResultMetaByLocale);


  app.post('/export', api_results.postResults, api_results.export_to_excel);

  // Test Information Paths
  app.get('/files', api_file_data.getAvailableTests);
  app.post('/run-test', api_file_data.runTest);

  app.get('/test-runner', api_file_data.getAvailableTests, api_file_data.getProcesses);
  app.get('/test-runner/:script', api_file_data.runTest);

  app.get('/dashboard', main.getHome);

  app.post('/detect', language.postLanguage);


  // Configure static file serving
  app.use(express.static('public'));
  app.use(express.static('node_modules'));

  // Congfigure Angular Routing 
  //app.use(express.static(path.join(__dirname, '../dist')));

  //
  // Old Routing Method
  //
  //app.use('/dashboard', api_dashboard);
  /*
  // test output page
  app.use('/output', output);

 app.use('/main', main);  

  // Express Routing Routes
  app.use('/result', api_results);

BGX  app.use('/language', lang_detect)

  app.use('/result/:template/:language/:result', api_results);

  app.use('/files', api_file_data);


  */

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
    var err = new Error('404 PAGE NOT FOUND');
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

    console.log('\x1b[31m',err);

    res.render('error', {
      title: 'YOU\'VE REACHED THE ERROR PAGE',
      error: err.message
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
