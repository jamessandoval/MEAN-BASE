// Invoke 'strict' JavaScript mode
'use strict';

//const db = require('../../config/sequelize');
var mysql = require('mysql');
const Sequelize = require('sequelize');
const async = require('async');
const util = require('util');
const dateFormat = require('dateformat');


// Add Notes to result table in database
exports.addNotesToResultTable_DB = function(req, res) {
  //console.log('Hey Waldo, run the addOwnerToDB function!');
  //res.send("hello from waldo");

  // Gets the value from url string using get
  /*let feature = req.query.feature;
  let locale = req.params.locale;
  let testcaseid = req.query.testcaseid;
  let testPassId = req.query.testpassid;
  let template = req.params.template;
  let language = req.params.language;
  let result = req.query.result;
  let urls = req.query.urls;
  let output = req.query.output;
  let rundate = req.params.rundate;
  let owner = req.query.users;*/
  let id = req.query.Id;
  let notes = req.query.message;


  var db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    dialect: 'mysql',
    user: "flukeqa",
    password: "H0lidayApples",
    database: "test"
  });


  // This script is used for testing variables
  /*db.connect(function(err) {
    if (err) throw err;
    //console.log("Connected! - " + id);
    res.end('working - ' + id + ' - ' + notes);

  });*/


  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //var sql = "UPDATE result SET Notes = CONCAT('"+oldValue+"', '"+newValue+"') WHERE Id = '"+id+"'";
    var sql = "UPDATE result SET Notes = '"+notes+"' WHERE Id = '"+id+"'";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record Notes inserted");

    });
    //connection.end(); // not being used at the moment
  });
    res.redirect('back'); // used to redirect page back on submit
  
  
  /*db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO result (TestCaseId, TestPassId, Template, Language, Result, URLs, Output, RunDate, Owner, Notes) VALUES ('"+testcaseid+"', '"+testpassid+"', '"+template+"', '"+language+"', '"+result+"', '"+urls+"', '"+output+"', '"+rundate+"', '"+owner+"', '"+notes+"')";

    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");

    });
  });*/

}; // end exports.addOwnerToDB = function(req, res)



// Add Owner to result table in database
exports.addOwnerToResultTable_DB = function(req, res) {

  // Gets the value from url string using get
  let id = req.query.Id;
  let owner = req.query.users;

  var db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    dialect: 'mysql',
    user: "flukeqa",
    password: "H0lidayApples",
    database: "test"
  });


  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "UPDATE result SET Owner = '"+owner+"' WHERE Id = '"+id+"'";

    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record Owner inserted");

    });
    //connection.end(); // not being used at the moment
  });
    //res.redirect('back'); // used to redirect page back on submit

}; // end exports.addOwnerToResultTable_DB = function(req, res)

