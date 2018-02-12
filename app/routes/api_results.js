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

    var template = null;
    var language = null;
    var result = null;

    //console.log("template: " + req.params.template);
    //console.log("language: " + req.params.language);
    //console.log("result: " + req.params.result);

    if(req.params.template != null){
      template = req.params.template;
    }

    if(req.params.language != null){
      language = req.params.language;
    }

    if(req.params.result != null){
      result = req.params.result;
    }

    // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
    db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language = '${language}' and Result = '${result}';`).then(results =>{

      for (var i = results.length - 1; i >= 0; i--) {
        results[i].Output = String(results[i].Output);
      } 

      res.send(results);

    }).catch(function(err){
      console.log('error: ' + err);
        return err;

    })
});

module.exports = router;
