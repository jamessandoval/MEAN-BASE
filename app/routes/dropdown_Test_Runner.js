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

