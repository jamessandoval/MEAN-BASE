'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Excel = require('exceljs');
const streamify = require('stream-array');
const os = require('os');

// Read Excel File Data
const fs = require('fs');
const path = require('path');

//### NEED to find out correct path
let rootPath = path.normalize(__dirname + '../../../');
rootPath = rootPath + 'temp_directory';

// Excel functionality:
// https://github.com/guyonroche/exceljs#create-a-workbook

// OLD Export tool
exports.getExport = function(req, res) {

  db.Result.findAll().then(results => {

    var features = [];
    var languages = [];

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

    res.render('export', {
      title: 'Export Results',
      features: features,
      languages: languages,
      user: req.user.firstname

    });
  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
};


// New export tool
exports.getExportFromResults = function(req, res, next) {

  //console.log(req.query.feature);
  //console.log(req.query.language);
  //console.log(req.query.testresult);
  //console.log(typeof(req.query.testresult));

  // TODO: Export all tool

  let language = req.query.language;
  let feature = req.query.feature;
  let testresult = req.query.testresult;
  let query = req.query.query;
  let langArray = [];
  let fArray = [];

  if (language.includes(",")){
    langArray=language.split(",");
  }
  if (feature.includes(",")){
    fArray=feature.split(",");
  }

  query = query.replace(/ /g, "%");

  ///results/locale/:locale'
  if (feature === "All" && testresult === "") {

    db.sequelize.query(`SELECT * from Result where Language = '${language}';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

    ///results/locale/:locale/testresult/:testresult'
  } else if (feature === "All" && testresult !== "") {

    db.sequelize.query(`SELECT * from Result where Language = '${language}' and Result = '${testresult}';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;
      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

    //results/feature/:template/query/:custom
  } else if (feature !== "All" && language === "All" && testresult === "" && query !== "") {

    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Output like '%${query}%';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

    //results/feature/:template/query/:custom/testresult/:testresult
  } else if (feature !== "All" && language === "All" && testresult !== "" && query !== "") {

    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Result = '${testresult}'and Output like '%${query}%';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

  } else if (feature !== "All" && language !== "All" && testresult === "" && query === "") {

    // if (langArray.length > 0 && fArray.length > 0){
    //   for (var x=0; x<langArray.length; x++){
    //     for (var y=0; y<fArray.length; y++){
    //       db.sequelize.query(`SELECT * from Result where Template = '${fArray[y]}' and language = '${langArray[x]}';`).then(results => {
    //         results += results[0];
    //         for (var i = 0; i < results.length; i++) {
    //           results[i].Output = String(results[i].Output);
    //         }
    //         req.results = results;
    //         req.language = language;
    //         req.testresult = testresult;
    //         return next();
    //       }).catch(function(err) {
    //         console.log('error: ' + err);
    //         return err;
    //       })
    //     }
    //   }
    // }
    // else if (langArray.length > 0){
    //   for (var y=0; y<langArray.length; y++){
    //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and language = '${langArray[y]}';`).then(results => {
    //       results += results[0];
    //       for (var i = 0; i < results.length; i++) {
    //         results[i].Output = String(results[i].Output);
    
    //       }
    
    //       req.results = results;
    
    //       req.language = language;
    //       req.testresult = testresult;
    
    //       return next();
    
    //     }).catch(function(err) {
    //       console.log('error: ' + err);
    //       return err;
    //     })
    //   }
    // }
    // else if (fArray.length > 0){
    //   for (var y=0; y<fArray.length; y++){
    //     db.sequelize.query(`SELECT * from Result where Template = '${fArray[y]}' and language = '${language}';`).then(results => {
    //       results += results[0];
    //       for (var i = 0; i < results.length; i++) {
    //         results[i].Output = String(results[i].Output);
    
    //       }
    
    //       req.results = results;
    
    //       req.language = language;
    //       req.testresult = testresult;
    
    //       return next();
    
    //     }).catch(function(err) {
    //       console.log('error: ' + err);
    //       return err;
    //     })
    //   }
    // }


    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and language = '${language}';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

  }else if (feature !== "All" && language !== "All" && testresult !== "" && query === "") {

    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Result = '${testresult}' and language = '${language}';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

  }else if (feature !== "All" && language !== "All" && query !== "" && testresult === "" ) {

    console.log("I am executing.\n\n\n");

    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Language = '${language}' and Output like '%${query}%';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

  }else if (feature !== "All" && language !== "All" && query !== "" && testresult !== "" ) {

    console.log("I am executing.\n\n\n");

    db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Language = '${language}' and Output like '%${query}%' and Result = '${testresult}';`).then(results => {

      results = results[0];

      // Needed To convert the blob object into a string 
      // Otherwise it returns a buffer array object.
      for (var i = 0; i < results.length; i++) {
        results[i].Output = String(results[i].Output);

      }

      req.results = results;

      req.language = language;
      req.testresult = testresult;

      return next();

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    })

  }

};

// Inititally Supportes only a feature 
// and a language Combination.
exports.export_to_excel = function(req, res) {

  /*
  // read from a file
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(filename)
    .then(function() {
      // use workbook
    });
  */

  let results = req.results;
  //let fileName = `Report-${results[0].Template}-${results[0].Language}.xlsx`;

  let fileName = `export.xlsx`;
  let filepath = rootPath + '/' + 'SelectedTestResults.xlsx';
  let status = "fail";

  res.status(200);
  res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-type', 'application/vnd.ms-excel');

  // Set options for Streaming large files
  let streamOptions = {
    filename: filepath,
    stream: res, // write to server response
    useStyles: false,
    useSharedStrings: false
  };


  let workbook = new Excel.stream.xlsx.WorkbookWriter(streamOptions);

  let worksheet = workbook.addWorksheet('Raw_Data');

  worksheet.columns = [
    { header: 'Scenario Id:', key: 'ScenarioNumber', width: 20 },
    { header: 'Test Run Id:', key: 'TestRunId', width: 32 },
    { header: 'Run Date/Time:', key: 'RunDate', width: 10 },
    { header: 'Template:', key: 'Template', width: 10 },
    { header: 'Language:', key: 'Language', width: 10 },
    { header: 'Result:', key: 'Result', width: 10 },
    { header: 'URL:', key: 'URLs', width: 50 },
    { header: 'Output:', key: 'Output', width: 100 }
  ];

  console.log("the size of results is " + results.length);

  processItems(0);

  function processItems(j) {

    if (j < results.length) {

      worksheet.addRow({
        id: results[j].ScenarioNumber,
        TestRunId: results[j].TestRunId,
        RunDate: results[j].RunDate,
        Template: results[j].Template,
        Language: results[j].Language,
        Result: results[j].Result,
        URLs: results[j].URLs,
        Output: results[j].Output
      }).commit();

      setTimeout(() => { processItems(j + 1); });

    } else {

      // close the stream

      workbook.commit();

      console.log("The Export File has been written.");
      res.end()

    }
  };
};
