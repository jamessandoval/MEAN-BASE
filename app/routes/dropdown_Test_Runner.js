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
exports.getOverview = function(req, res) {

  db.Result.findAll().then(results => {


    // Needed To convert the blob object into a string 
    // Otherwise it returns a buffer array object.
    for (var i = 0; i < results.length; i++) {
      results[i].Output = String(results[i].Output);

      // // Save each unique template
      // if (!features.includes(results[i].Template)) {
      //   features.push(results[i].Template);
      // }

      // // Save Each unique Language
      // if (!languages.includes(results[i].Language)) {
      //   languages.push(results[i].Language);
      // }
    }

    res.render('dropdownTestRunner', {
      title: 'Run Tests',
      // features: features,
      // languages: languages,
      user: req.user.firstname

    });
  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
};


// // // New export tool
// // exports.getExportFromResults = function(req, res, next) {

// //   //console.log(req.query.feature);
// //   //console.log(req.query.language);
// //   //console.log(req.query.testresult);
// //   //console.log(typeof(req.query.testresult));

// //   // TODO: Export all tool

// //   let language = req.query.language;
// //   let feature = req.query.feature;
// //   let testresult = req.query.testresult;
// //   let query = req.query.query;

// //   query = query.replace(/ /g, "%");

// //   ///results/locale/:locale'
// //   if (feature === "All" && testresult === "") {

// //     db.sequelize.query(`SELECT * from Result where Language = '${language}';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //     ///results/locale/:locale/testresult/:testresult'
// //   } else if (feature === "All" && testresult !== "") {

// //     db.sequelize.query(`SELECT * from Result where Language = '${language}' and Result = '${testresult}';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;
// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //     //results/feature/:template/query/:custom
// //   } else if (feature !== "All" && language === "All" && testresult === "" && query !== "") {

// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Output like '%${query}%';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //     //results/feature/:template/query/:custom/testresult/:testresult
// //   } else if (feature !== "All" && language === "All" && testresult !== "" && query !== "") {

// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Result = '${testresult}'and Output like '%${query}%';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //   } else if (feature !== "All" && language !== "All" && testresult === "" && query === "") {


// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and language = '${language}';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //   }else if (feature !== "All" && language !== "All" && testresult !== "" && query === "") {

// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Result = '${testresult}' and language = '${language}';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //   }else if (feature !== "All" && language !== "All" && query !== "" && testresult === "" ) {

// //     console.log("I am executing.\n\n\n");

// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Language = '${language}' and Output like '%${query}%';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //   }else if (feature !== "All" && language !== "All" && query !== "" && testresult !== "" ) {

// //     console.log("I am executing.\n\n\n");

// //     db.sequelize.query(`SELECT * from Result where Template = '${feature}' and Language = '${language}' and Output like '%${query}%' and Result = '${testresult}';`).then(results => {

// //       results = results[0];

// //       // Needed To convert the blob object into a string 
// //       // Otherwise it returns a buffer array object.
// //       for (var i = 0; i < results.length; i++) {
// //         results[i].Output = String(results[i].Output);

// //       }

// //       req.results = results;

// //       req.language = language;
// //       req.testresult = testresult;

// //       return next();

// //     }).catch(function(err) {
// //       console.log('error: ' + err);
// //       return err;
// //     })

// //   }

// // };

