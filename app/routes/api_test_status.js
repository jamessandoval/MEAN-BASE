// test Status

'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');
const async = require('async');
const util = require('util');
const dateFormat = require('dateformat');

// Read Excel File Data
var fs = require('fs');
var path = require('path');

//### NEED to find out correct path
var rootPath = path.normalize(__dirname + '../../../');
var rootPath = rootPath + 'temp_directory';

exports.getTestStatus = function(req, res) {

  db.Status.findAll().then(results => {

    // Needed To convert the blob object into a string 
    // Otherwise it returns a buffer array object.
    for (var i = 0; i < results.length; i++) {
      results[i].Output = String(results[i].Output);
      //results[i].RunDate = dateFormat(results[i].RunDate, "dddd, mmmm dS, yyyy, h:MM:ss TT"); // + " PST";
      //results[i].StartTime = dateFormat(results[i].StartTime, "dddd, mmmm dS, yyyy, h:MM:ss TT"); // + " PST";
      //results[i].EndTime = dateFormat(results[i].EndTime, "dddd, mmmm dS, yyyy, h:MM:ss TT"); // + " PST";

    }

    res.render('test_status', {

    	results: results

    });

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
}

