'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// Read Excel File Data
var fs = require('fs');
var path = require('path');

//### NEED to find out correct path
var rootPath = path.normalize(__dirname + '../../../');
var rootPath = rootPath + 'temp_directory';

// Excel functionality:
// https://github.com/guyonroche/exceljs#create-a-workbook
const Excel = require('exceljs');

// result
exports.postResults = function(req, res, next) {

  console.log(req.body.features);

  var features = req.body.features;
  // Features is an array of objects
  var resultCompilation = [];

  if (features[0].name === "all" && features[0].locale !== "all") {

    getResultsTotalLanguages(features);

    function getResultsTotalLanguages(features) {
      var j = 0;
      var promises = features.map(function(item) { // return array of promises
        return db.sequelize.query(`SELECT * FROM results WHERE Language = '${features[j++].locale}';`)
          .then(data => {

            resultCompilation = resultCompilation.concat(data[0]);

          }, function(err) {
            console.error('error: ' + err);
            return err;
          });
      });

      Promise.all(promises).then(function() {

        resultCompilation[0].Template = "all";
        // Process Output strings to return correct values
        for (var i = 0; i < resultCompilation.length; i++) {
          resultCompilation[i].Output = String(resultCompilation[i].Output);

        }
        //res.redirect('/result');
        //res.send("test");
        req.results = resultCompilation;
        next();
      })
    }
  } else if (features[0].name === "all" && features[0].locale === "all") {

    getResultsTotal(features);

    function getResultsTotal(features) {
      var j = 0;
      var promises = features.map(function(item) { // return array of promises
        return db.sequelize.query(`SELECT * FROM results;`)
          .then(data => {

            resultCompilation = resultCompilation.concat(data[0]);

          }, function(err) {
            console.error('error: ' + err);
            return err;
          });
      });

      Promise.all(promises).then(function() {

        resultCompilation[0].Template = "all";
        resultCompilation[0].locale = "all";
        // Process Output strings to return correct values
        for (var i = 0; i < resultCompilation.length; i++) {
          resultCompilation[i].Output = String(resultCompilation[i].Output);

        }
        //res.redirect('/result');
        //res.send("test");
        req.results = resultCompilation;
        next();
      })
    }
  } else {

    getResultsTotal(features);

    function getResultsTotal(features) {
      var j = 0;
      var promises = features.map(function(item) { // return array of promises
        //console.log("the value of name is " + features[j].name);
        //console.log("the value of locale is " + features[j].locale);
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
        req.results = resultCompilation;
        next();
      })
    }
  }
};

// Inititally Supportes only a feature 
// and a language Combination.
exports.export_to_excel = function(req, res, next) {

  /*
  // read from a file
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(filename)
    .then(function() {
      // use workbook
    });
  */

  let results = req.results;
  const filepath = rootPath + '/' + `Report-${results[0].Template}-${results[0].Language}.xlsx`;
  let workbook = new Excel.Workbook();
  workbook.created = new Date();
  workbook.properties.date1904 = true;
  let status = "fail";

  var worksheet = workbook.addWorksheet('Test report');

  worksheet.columns = [
    { header: 'ID:', key: 'id', width: 10 },
    { header: 'Test Run Id:', key: 'TestRunId', width: 32 },
    { header: 'Run Date/Time:', key: 'RunDate', width: 10 },
    { header: 'Template:', key: 'Template', width: 10 },
    { header: 'Language:', key: 'Language', width: 10 },
    { header: 'Result:', key: 'Result', width: 10 },
    { header: 'URL:', key: 'URLs', width: 50 },
    { header: 'Output:', key: 'Output', width: 100 }
  ];

  console.log("the size of results is " + results.length);
  processItems(0);

  function processItems(j) {

    if (j < results.length) {

      worksheet.addRow({
        id: results[j].ID,
        TestRunId: results[j].TestRunId,
        RunDate: results[j].RunDate,
        Template: results[j].Template,
        Language: results[j].Language,
        Result: results[j].Result,
        URLs: results[j].URLs,
        Output: results[j].Output
      });
      setTimeout(() => { processItems(j + 1); });

    } else {
      workbook.xlsx.writeFile(filepath).then(function() {
        console.log("The Export File has been written.");
      });
    }
  };
};

/* GET ALL Results */
exports.getResults = function(req, res) {

  var features = [];
  var languages = [];

  if (!req.results) {
    db.results.findAll().then(results => {

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
      res.render('results', {
        title: 'All Possible Results - Most Recent Only',
        features: features,
        languages: languages,
        results: results,
        length: results.length,
        myVar: "hello word"
      });

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    });
  } else {

    var results = req.results;

    for (var i = 0; i < results.length; i++) {

      // Save each unique template
      if (!features.includes(results[i].Template)) {
        features.push(results[i].Template);
      }

      // Save Each unique Language
      if (!languages.includes(results[i].Language)) {
        languages.push(results[i].Language);
      }
    }

    res.render('results', {
      title: "results from the post request",
      features: features,
      languages: languages,
      results: results,
      length: results.length,
      myVar: "hello word"
    })
  };
};


/* QEURY SINGLE TEST CASES */
exports.getResultByIdAndLanguage = function(req, res) {


  let template = req.params.template;
  let language = req.params.locale;
  let total = null

  // Pagination Logic Part I of II Begins here

  let page = null;
  let start = 0;
  let end = 0;
  let rowsToReturn = 25;

  if (typeof req.params.page === 'undefined') {
    // the variable is define
    req.params.page;
    page = 1;

  } else {

    page = req.params.page;

  }

  if (page === '1') {

    page = 0;

  } else {

    page = page - 1;

  }

  start = page * rowsToReturn;

  // Pagination Logic Part I of II Ends Here

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language = '${language}' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from results WHERE Template = '${template}' AND Language = '${language}'`).then(count => {

      // Obtain Total count from query
      let Totalcount = count[0];

      Totalcount = JSON.stringify(count[0]);

      Totalcount = Totalcount.replace("[{\"count(*)\":", "");
      Totalcount = Totalcount.replace("}]", "");
      Totalcount = parseInt(Totalcount);

      // Parse Results based on previous Query

      // Pagination Logic Part II Begins Here

      total = Totalcount;

      // Get total number of pages
      let pages = Math.ceil(total / rowsToReturn);

      results = results[0];
      console.log("Number of pages is " + pages);

      end = start + results.length;

      if (page === 0) {
        page = 1;
      } else {
        ++page;

      }

      // Pagination Logic Part II Ends Here

      for (let i = results.length - 1; i >= 0; i--) {
        results[i].Output = String(results[i].Output);
      }

      console.log("template is " + template)

      res.render('results_custom', {
        title: 'Report Page',
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total
      });

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};

exports.getTotalResultCount = function(req, res) {

  let feature = "ALL";
  let language = "ALL";
  let pass = 0;
  let fail = 0;
  let skip = 0;

  // select count(*) from results where result = 'PASS';
  db.sequelize.query(`select count(*) from results where result = 'PASS';`).then(results => {

    results = results[0];

    pass = JSON.stringify(results[0]);
    pass = pass.replace("{\"count(*)\":", "");
    pass = pass.replace("}", "");
    pass = parseInt(pass);

    // Call next query:

    // select count(*) from results where result = 'FAIL';
    db.sequelize.query(`select count(*) from results where result = 'FAIL';`).then(results => {

      results = results[0];

      fail = JSON.stringify(results[0]);
      fail = fail.replace("{\"count(*)\":", "");
      fail = fail.replace("}", "");
      fail = parseInt(fail);

      // select count(*) from results where result = 'SKIP';
      db.sequelize.query(`select count(*) from results where result = 'SKIP';`).then(results => {

        results = results[0];

        skip = JSON.stringify(results[0]);
        skip = skip.replace("{\"count(*)\":", "");
        skip = skip.replace("}", "");
        skip = parseInt(skip);

        res.send({
          feature: feature,
          language: language,
          pass: pass,
          fail: fail,
          skip: skip
        });

      }).catch(function(err) {
        console.log('error: ' + err);
        return err;

      })

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};




//From express.js:
//app.get('/results/:template/:locale/:testResult/:page', api_results.getResultByLangFeatureAndTestResult);

exports.getResultByLangFeatureAndTestResult = function(req, res) {

  let template = req.params.template;
  let language = req.params.locale;
  let testResults = req.params.testResult;

  let total = null
  // Pagination Logic Part I of II Begins here

  let page = null;
  let start = 0;
  let end = 0;
  let rowsToReturn = 25;

  if (typeof req.params.page === 'undefined') {
    // the variable is define
    req.params.page;
    page = 1;

  } else {

    page = req.params.page;

  }

  if (page === '1') {

    page = 0;

  } else {

    page = page - 1;

  }

  start = page * rowsToReturn;

  // Pagination Logic Part I of II Ends Here


  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM results WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testResults}' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from results WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testResults}'`).then(count => {

      // Obtain Total count from query
      let Totalcount = count[0];

      Totalcount = JSON.stringify(count[0]);

      Totalcount = Totalcount.replace("[{\"count(*)\":", "");
      Totalcount = Totalcount.replace("}]", "");
      Totalcount = parseInt(Totalcount);

      // Pagination Logic Part II Begins Here

      total = Totalcount;

      // Get total number of pages
      let pages = Math.ceil(total / rowsToReturn);

      results = results[0];
      console.log("Number of pages is " + pages);

      end = start + results.length;

      if (page === 0) {
        page = 1;
      } else {
        ++page;

      }

      // Pagination Logic Part II Ends Here

      for (let i = results.length - 1; i >= 0; i--) {
        results[i].Output = String(results[i].Output);
      }

      res.render('results_custom', {
        title: 'Report Page',
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total
      });

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};



// from express.js:
// app.get('/allresults/:locale/:testResult', api_results.getResultByLangAndTestResult);
exports.getResultByLangAndTestResult = function(req, res) {

  var features = [];
  var languages = [];
  let lang = req.params.locale;
  let testResults = req.params.testResult;

  if (!req.results) {
    db.results.findAll({ where: { Language: lang, Result: testResults } }).then(results => {

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
      res.render('allresults', {
        title: 'All Pass / Skip / Fail',
        features: features,
        languages: languages,
        results: results,
        length: results.length,
        myVar: "hello word"
      });

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;
    });
  } else {

    var results = req.results;

    for (var i = 0; i < results.length; i++) {

      // Save each unique template
      if (!features.includes(results[i].Template)) {
        features.push(results[i].Template);
      }

      // Save Each unique Language
      if (!languages.includes(results[i].Language)) {
        languages.push(results[i].Language);
      }
    }

    res.render('allresults', {
      title: "results from the post request",
      features: features,
      languages: languages,
      results: results,
      length: results.length,
      myVar: "hello word"
    })
  };
};
