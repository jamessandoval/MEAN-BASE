// Invoke 'strict' JavaScript mode
'use strict';

//const db = require('../../config/sequelize');
var mysql = require('mysql');
const Sequelize = require('sequelize');
const async = require('async');
const util = require('util');
const dateFormat = require('dateformat');


// Add owner to database
exports.addOwnerToDB = function(req, res) {

  //console.log('Hey Waldo, run the addOwnerToDB function!');
  //res.send("hello from waldo");

  
    res.redirect('back');

}; // end exports.addOwnerToDB = function(req, res)
