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

/* GET SINGLE BOOK BY ID */
router.get('/:template/:language/:result', function(req, res) {

    // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
    db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language LIKE '${language}';`).then(results =>{

      for (var i = results.length - 1; i >= 0; i--) {
        results[i].Output = String(results[i].Output);

      }

      var total = results.length;

      res.send({
        results: results,
        totalNum: total,
        pass: 100,
        fail: 20,
        skip: 5
      });

    }).catch(function(err){
      console.log('error: ' + err);
        return err;

    })
});

// result
router.post('/', function(req, res){

  var features = req.body.features;
  // Features is an array

  res.send(features);


});


















module.exports = router;
