'use strict';

var db = require('../../config/sequelize');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var express = require('express');
var router = express.Router();


/* GET ALL Results */
router.get('/', function(req, res) {
	db.results.findAll().then(results => {
  		
		// Needed To convert the blob object into a string 
		// Otherwise it returns a buffer array object.
  		for (var i = results.length - 1; i >= 0; i--) {
  			results[i].Output = String(results[i].Output);
  		}
  		
  		res.send(results);

	}).catch(function(err){
    	console.log('error: ' + err);
        return err;
    });
});

module.exports = router;
