'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop');

const Op = Sequelize.Op;

// Read Excel File Data
var fs = require('fs');
var path = require('path');

//### NEED to find out correct path
var rootPath = path.normalize(__dirname + '../../../');
var rootPath = rootPath + 'temp_directory';

// Excel functionality:
// Documentation Can be found here:
// https://github.com/guyonroche/exceljs#create-a-workbook
const Excel = require('exceljs');

// result
exports.postResults = function(req, res, next) {

  console.log(req.body.features);

  var features = req.body.features;
  // Features is an array of objects
  var resultCompilation = [];

  getResultsTotal(features);

  function getResultsTotal(features) {
    var j = 0;
    var promises = features.map(function(item) { // return array of promises
      console.log("the value of name is " + features[j].name);
      console.log("the value of locale is " + features[j].locale);
      return db.sequelize.query(`SELECT * FROM results WHERE Template = '${features[j].name}' AND Language LIKE '${features[j++].locale}';`)
        .then(data => {

          resultCompilation = resultCompilation.concat(data[0]);

        }, function(err) {
          console.error('error: ' + err);
          return err;
        });
    });

    Promise.all(promises).then(function() {
      // Process Output strings to return correct values
      for (var i = 0; i < resultCompilation.length; i++) {
        resultCompilation[i].Output = String(resultCompilation[i].Output);

      }
      //res.redirect('/result');
      //res.send("test");
      req.results = resultCompilation;
      next();
    })
  }
};

// Inititally Supportes only a feature 
// and a language Combination.
exports.export_to_excel = function(req, res, next) {

  let results = req.results;
  const filepath = rootPath + '/' + `Report-${results[0].Template}-${results[0].Language}.xlsx`;  
  let workbook = new Excel.Workbook();
  workbook.created = new Date();
  workbook.properties.date1904 = true;
  let status = "fail";

  var worksheet = workbook.addWorksheet('Test report');

  worksheet.columns = [
    { header: 'ID:', key: 'id', width: 10 },
    { header: 'Test Run Id:', key: 'TestRunId', width: 32 },
    { header: 'Run Date/Time:', key: 'RunDate', width: 10 },
    { header: 'Template:', key: 'Template', width: 10 },
    { header: 'Language:', key: 'Language', width: 10 },
    { header: 'Result:', key: 'Result', width: 10 },
    { header: 'URL:', key: 'URLs', width: 50 },
    { header: 'Output:', key: 'Output', width: 100 }
  ];
  processItems(0);
  function processItems(j) {

    if (j < results.length) {

      worksheet.addRow({
        id: results[j].ID,
        TestRunId: results[j].TestRunId,
        RunDate: results[j].RunDate,
        Template: results[j].Template,
        Language: results[j].Language,
        Result: results[j].Result,
        URLs: results[j].URLs,
        Output: results[j].Output
      });

      processItems(j + 1);

    } else {
      workbook.xlsx.writeFile(filepath);
      
    }
  };

  console.log("great success");
  //res.sendFile('filepath' , { root : __dirname});
  //res.redirect(301, '/');
  //res.sendFile(filepath);
};

/* GET ALL Results */
exports.getResults = function(req, res) {

  var features = [];
  var languages = [];

  if (!req.results) {
    db.results.findAll().then(results => {

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

        // Save each unique template
        if (!features.includes(results[i].Template)) {
          features.push(results[i].Template);
        }

        // Save Each unique Language
        if (!languages.includes(results[i].Language)) {
          languages.push(results[i].Language);
        }

      }
      res.render('results', {
        title: 'All Possible Results',
        features: features,
        languages: languages,
        results: results,
        length: results.length,
        myVar: "hello word"
      });

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    });
  } else {

    var results = req.results;

    for (var i = 0; i < results.length; i++) {

      // Save each unique template
      if (!features.includes(results[i].Template)) {
        features.push(results[i].Template);
      }

      // Save Each unique Language
      if (!languages.includes(results[i].Language)) {
        languages.push(results[i].Language);
      }
    }

    res.render('results', {
      title: "results from the post request",
      features: features,
      languages: languages,
      results: results,
      length: results.length,
      myVar: "hello word"
    })
  };
};


/* QEURY SINGLE TEST CASES */
exports.getResultByIdAndLanguage = function(req, res) {

  console.log("hello from this path");

  console.log(req.query.template);

  var template = "f4";
  var language = "en-us";

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language LIKE '${language}';`).then(results => {

    for (var i = results.length - 1; i >= 0; i--) {
      results[i].Output = String(results[i].Output);

    }

    var total = results.length;
    res.send(res.locals.dataProcessed);

    res.render('results', {
      results: results,
      title: 'Report Page',
      length: total,
      pass: 100,
      fail: 20,
      skip: 5
    });


  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};
