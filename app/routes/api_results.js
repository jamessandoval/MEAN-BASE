'use strict';

var db = require('../../config/sequelize');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var express = require('express');
var router = express.Router();

// result
router.post('/', function(req, res,next) {

  console.log(req.body.features);

  var features = req.body.features;
  // Features is an array of objects
  var resultCompilation = [];

  getResultsTotal(features);

  function getResultsTotal(features) {
    var j = 0;
    var promises = features.map(function(item) { // return array of promises
      console.log("the value of name is " + features[j].name);
      console.log("the value of locale is " + features[j].locale);
      return db.sequelize.query(`SELECT * FROM results WHERE Template = '${features[j].name}' AND Language LIKE '${features[j++].locale}';`)
        .then(data => {

          resultCompilation = resultCompilation.concat(data[0]);

        }, function(err) {
          console.error('error: ' + err);
          return err;
        });
    });

    Promise.all(promises).then(function() {
      // Process Output strings to return correct values
      for (var i = 0; i < resultCompilation.length; i++) {
        resultCompilation[i].Output = String(resultCompilation[i].Output);

      }
      //res.redirect('/result');
      //res.send("test");
      next();
    })
  }
});

/* GET ALL Results */
router.get('/', function(req, res) {
  console.log("hello from main");
  db.results.findAll().then(results => {

    // Needed To convert the blob object into a string 
    // Otherwise it returns a buffer array object.
    for (var i = results.length - 1; i >= 0; i--) {
      results[i].Output = String(results[i].Output);
    }

    res.send(results);

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
});

/* QEURY SINGLE TEST CASES */
router.get('/:template', function(req, res) {

  console.log("hello from this path");

  console.log(req.query.template);

  var template = "f4";
  var language = "en-us";

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language LIKE '${language}';`).then(results => {

    for (var i = results.length - 1; i >= 0; i--) {
      results[i].Output = String(results[i].Output);

    }

    var total = results.length;

    res.send(res.locals.dataProcessed);


    res.render('results', {
      results: results,
      title: 'Report Page',
      length: total,
      pass: 100,
      fail: 20,
      skip: 5
    });


  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
});



module.exports = router;
