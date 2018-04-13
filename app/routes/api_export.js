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
    db.TestPass.findAll().then(dateTimes =>{

        var features = [];
        var languages = [];
        var dates =[];
        var datesIds = [];

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

        // getting each unique date
        for (var i = 0; i < dateTimes.length; i++) {
          dateTimes[i].Output = String(dateTimes[i].Output);
          dates.push(dateTimes[i].RunDate);
          datesIds.push(dateTimes[i].TestPassId);
        }

        res.render('export', {
          title: 'Export Results',
          features: features,
          languages: languages,
          user: req.user.firstname,
          dates: dates,
          dateIds: datesIds
        });

        return null;

      }).catch(function(err) {
        console.log('error: ' + err);
        return err;
      });

      return null;

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
  let testPass = req.query.testpassid;
  if(testPass != "All"){
    let loopedQuery='SELECT * from Result where TestPassId = ' + testPass + " AND ";
  } else {
    let loopedQuery='SELECT * from Result;';
  }
  let results = null;

 


  //---------------------------------------------------------start of multiple choice query builder ------------------>
  //below we are looking to see if multiple choices were selected for either template or language and build a query that works for the selections
  if (language.includes(",") && feature.includes(",")){ //if multiple selections were made for both template and language...

    langArray=language.split(",");
    fArray=feature.split(",");

    loopedQuery +='(Language = ' + "'" + langArray[0] + "'";
    for (var x = 1; x<langArray.length; x++){
      loopedQuery += " OR Language = " + "'" + langArray[x] + "'";
    }
    loopedQuery += ") AND (";
    loopedQuery +='Template = ' + "'"+ fArray[0] + "'";
    for (var x = 1; x<fArray.length; x++){
      loopedQuery += " OR Template = " + "'"+ fArray[x] + "'";
    }
    loopedQuery += ");";

  }else if (language.includes(",") && !feature.includes(",")){ //if multiple selections were made for language only

    langArray=language.split(",");
    loopedQuery +='(Language = ' + "'" +langArray[0] + "'";
    for (var x = 1; x<langArray.length; x++){
      loopedQuery += " OR Language = " + "'" + langArray[x] + "'";
    }
    loopedQuery += ") AND Template = " + "'"  + feature + "'";

  } else if (feature.includes(",") && !language.includes(",")){// if multiple selections were made for features only

    fArray=feature.split(",");
    loopedQuery +='(Template = ' + "'" + fArray[0] + "'";
    for (var x = 1; x<fArray.length; x++){
      loopedQuery += " OR Template = " + "'" + fArray[x]+ "'";
    }
    loopedQuery += ") AND Language = "  + "'" + language + "'";
  }
  //---------------------------------------------------------end of multiple choice query builder ------------------>
  // if multiple selections were made for either language or template, the first 'if' statement below will run



  query = query.replace(/ /g, "%");

  ///results/locale/:locale'
  if (langArray.length > 0 || fArray.length > 0){
    db.sequelize.query(loopedQuery).then(results =>{

      results = results[0];
      // Needed To convert the blob object into a string Otherwise it returns a buffer array object.
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

  }else if (feature ==="All" && language ==="All"){
 
      db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}';`).then(results => {

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

    


  }else if (feature === "All" && testresult === "") {

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' AND Language = '${language}';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' AND Language = '${language}' and Result = '${testresult}';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' AND Template = '${feature}' and Output like '%${query}%';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' and Template = '${feature}' and Result = '${testresult}'and Output like '%${query}%';`).then(results => {

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

  } else if (feature !== "All" && language !== "All" && testresult === "" && query === "") {  // if only one selection was made for language and one for feature
   
    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' and Template = '${feature}' and language = '${language}';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' and Template = '${feature}' and Result = '${testresult}' and language = '${language}';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' and Template = '${feature}' and Language = '${language}' and Output like '%${query}%';`).then(results => {

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

    db.sequelize.query(`SELECT * from Result where TestPassId = '${testPass}' and Template = '${feature}' and Language = '${language}' and Output like '%${query}%' and Result = '${testresult}';`).then(results => {

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

  let worksheet = workbook.addWorksheet('Raw_Data',{
    views: [
    {state: 'frozen', ySplit: 1}
    ]
    });

  worksheet.columns = [
    { header: 'Test Case Id:', key: 'TestCaseId', width: 12 },
    { header: 'Test Pass Id:', key: 'TestRunId', width: 12 },
    { header: 'Run Date/Time:', key: 'RunDate', width: 10 },
    { header: 'Template:', key: 'Template', width: 10 },
    { header: 'Language:', key: 'Language', width: 10 },
    { header: 'Result:', key: 'Result', width: 10 },
    { header: 'URL:', key: 'URLs', width: 50 },
    { header: 'Scenario:', key: 'Output', width: 100 }
  ];
  


  console.log("the size of results is " + results.length);

  processItems(0);

  function processItems(j) {

    if (j < results.length) {

      worksheet.addRow({
        TestCaseId: results[j].TestCaseId,
        TestRunId: results[j].TestPassId,
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
