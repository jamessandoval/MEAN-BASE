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
        return db.sequelize.query(`SELECT * FROM Result WHERE Language = '${features[j++].locale}';`)
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
        return db.sequelize.query(`SELECT * FROM Result;`)
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
        return db.sequelize.query(`SELECT * FROM Result WHERE Template = '${features[j].name}' AND Language LIKE '${features[j++].locale}';`)
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
    { header: 'Scenario Id:', key: 'ScenarioNumber', width: 20 },
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
        id: results[j].ScenarioNumber,
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
// deprecated - exists only for example //
exports.getResults = function(req, res) {

  var features = [];
  var languages = [];
  let urlString = null;
  let basePath = null;

  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.
  let urlArray = req.url.split("/");

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();

    basePath = urlArray.slice(0);
    basePath.pop();


    urlString = urlArray.toString();
    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");
    req.url = urlString.replace(/,/g, "/");

  } else {

    basePath = urlArray.slice(0);
    basePath.pop();

    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");
  }

  req.url = req.url + "/";
  basePath = basePath + "/";

  // <!-- end of remove pagination

  if (!req.results) {
    db.result.findAll().then(results => {

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
        myVar: "hello word",
        currentUrl: req.url,
        basePath: basePath
      });

      return null;

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
      myVar: "hello word",
      currentUrl: req.url,
      basePath: basePath
    })
  };
};

///results/feature/:template/locale/:locale/query/:custom
exports.getResultByIdLanguageCustom = function(req, res) {

  let template = req.params.template;
  let language = req.params.locale;
  let custom = req.params.custom;
  let total = null;
  let basePath = null;
  let urlString = null;

  // Modify search query on ec2 to obtain correct result.
  custom = custom.replace(/ /g, "%");

  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/feature/${template}/locale/${language}/query/${custom}/testresult/`;
  pfsUrl = pfsUrl.replace(/%/g, " ");

  let urlArray = req.url.split("/");

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();

    basePath = urlArray.slice(0);
    basePath.pop();


    urlString = urlArray.toString();
    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");
    req.url = urlString.replace(/,/g, "/");

  } else {

    basePath = urlArray.slice(0);
    basePath.pop();

    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");
  }

  req.url = req.url + "/";
  basePath = basePath + "/";

  // <!-- end of remove pagination

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

  console.log("start is " + start);

  // Pagination Logic Part I of II Ends Here

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Language = '${language}' AND Output like '%${custom}%' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Language = '${language}' AND Output like '%${custom}%'`).then(count => {

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

      // Modify search query on ec2 to obtain correct result.
      custom = custom.replace(/%/g, " ");

      res.render('results_custom', {
        title: 'Results with Query: ' + custom,
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl: pfsUrl
      });
      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })
    return null;

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};

// getResultByLanguage

exports.getResultByLanguage = function(req, res) {

  let template = "All";
  let language = req.params.locale;
  let total = null
  let urlString = null;
  let basePath = null;

  // Pagination Logic Part I of II Begins here

  let page = null;
  let start = 0;
  let end = 0;
  let rowsToReturn = 25;

  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/locale/${language}/testresult/`;

  let urlArray = req.url.split("/");
  basePath = urlArray.slice(0);

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();
    basePath.pop();

    urlString = urlArray.toString();

    req.url = urlString.replace(/,/g, "/");

  } else {

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");

  }

  basePath = basePath.toString();
  basePath = basePath.replace(/,/g, "/");
  basePath = basePath + "/";

  req.url = req.url + "/";

  // <!-- end of remove pagination

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
  db.sequelize.query(`SELECT * FROM Result WHERE Language = '${language}' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Language = '${language}'`).then(count => {

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
        title: 'Report:',
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl: pfsUrl

      });
      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })
    return null;

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })

};

// results/feature/:template/locale/:language
exports.getResultByIdAndLanguage = function(req, res) {

  let template = req.params.template;
  let language = req.params.locale;
  let total = null
  let urlString = null;
  let basePath = null;

  // Pagination Logic Part I of II Begins here

  let page = null;
  let start = 0;
  let end = 0;
  let rowsToReturn = 25;


  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/feature/${template}/locale/${language}/testresult/`;


  let urlArray = req.url.split("/");
  basePath = urlArray.slice(0);

  // END IN WORK

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();
    basePath.pop();

    urlString = urlArray.toString();

    req.url = urlString.replace(/,/g, "/");

  } else {

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");

  }

  basePath = basePath.toString();
  basePath = basePath.replace(/,/g, "/");
  basePath = basePath + "/";

  req.url = req.url + "/";

  // <!-- end of remove pagination

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
  db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Language = '${language}' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Language = '${language}'`).then(count => {

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
        title: 'Test Results:',
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl: pfsUrl

      });

      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

    return null;

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
  db.sequelize.query(`select count(*) from Result where result = 'PASS';`).then(results => {

    results = results[0];

    pass = JSON.stringify(results[0]);
    pass = pass.replace("{\"count(*)\":", "");
    pass = pass.replace("}", "");
    pass = parseInt(pass);

    // Call next query:

    // select count(*) from results where result = 'FAIL';
    db.sequelize.query(`select count(*) from Result where result = 'FAIL';`).then(results => {

      results = results[0];

      fail = JSON.stringify(results[0]);
      fail = fail.replace("{\"count(*)\":", "");
      fail = fail.replace("}", "");
      fail = parseInt(fail);

      // select count(*) from results where result = 'SKIP';
      db.sequelize.query(`select count(*) from Result where result = 'SKIP';`).then(results => {

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
  let testresult = req.params.testresult;
  let urlString = null;
  let basePath = null;

  let total = null


  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/feature/${template}/locale/${language}/testresult/`;

  let urlArray = req.url.split("/");

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();

    basePath = urlArray.slice(0);
    basePath.pop();


    urlString = urlArray.toString();
    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");
    req.url = urlString.replace(/,/g, "/");

  } else {

    basePath = urlArray.slice(0);
    basePath.pop();

    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");
  }

  req.url = req.url + "/";
  basePath = basePath + "/";

  // <!-- end of remove pagination

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
  db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testresult}' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testresult}'`).then(count => {

      // Obtain Total count from query
      let Totalcount = count[0];

      Totalcount = JSON.stringify(count[0]);

      Totalcount = Totalcount.replace("[{\"count(*)\":", "");
      Totalcount = Totalcount.replace("}]", "");
      Totalcount = parseInt(Totalcount);

      console.log("Something should be here: " + testresult);

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
        title: 'Test Results:',
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl,
        pfsUrl
      });

      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

    return null;

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })
};

//app.get('/results/feature/:template/query/:custom', api_results.getResultByTemplateCustom);

exports.getResultByTemplateCustom = function(req, res) {

  let template = req.params.template;
  let language = "All";
  let custom = req.params.custom;
  let total = null;
  let basePath = null;
  let urlString = null;

  // Modify search query on ec2 to obtain correct result.
  custom = custom.replace(/ /g, "%");

  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/feature/${template}/query/${custom}/testresult/`;
  pfsUrl = pfsUrl.replace(/%/g, " ");

  console.log("This is custom:" + custom);


  let urlArray = req.url.split("/");

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();

    basePath = urlArray.slice(0);
    basePath.pop();


    urlString = urlArray.toString();
    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");
    req.url = urlString.replace(/,/g, "/");

  } else {

    basePath = urlArray.slice(0);
    basePath.pop();

    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");
  }

  req.url = req.url + "/";
  basePath = basePath + "/";

  // <!-- end of remove pagination

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

  console.log("start is " + start);

  // Pagination Logic Part I of II Ends Here

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Output like '%${custom}%' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Output like '%${custom}%'`).then(count => {

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

      // Modify search query on ec2 to obtain correct result.
      custom = custom.replace(/%/g, " ");

      res.render('results_custom', {
        title: 'Results with Query: ' + custom,
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl: pfsUrl
      });

      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

    return null;

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })

};

//app.get('/results/feature/:template/query/:custom/testresult/:testresult', api_results.getResultByTemplateCustomAndTestResult);

exports.getResultByTemplateCustomAndTestResult = function(req, res) {

  let template = req.params.template;
  let testResult = req.params.testresult;
  let language = "All";
  let custom = req.params.custom;
  let total = null;
  let basePath = null;
  let urlString = null;

  // Modify search query on ec2 to obtain correct result.
  custom = custom.replace(/ /g, "%");

  // Remove Pagination from current url variable
  // Additionally, obtain base path from current url.

  let pfsUrl = null;
  pfsUrl = `/results/feature/${template}/query/${custom}/testresult/`;
  pfsUrl = pfsUrl.replace(/%/g, " ");

  console.log("This is custom:" + custom);


  let urlArray = req.url.split("/");

  let regexNum = /^[0-9]*$/;

  if (urlArray[urlArray.length - 1].match(regexNum)) {

    urlArray.pop();

    basePath = urlArray.slice(0);
    basePath.pop();


    urlString = urlArray.toString();
    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");
    req.url = urlString.replace(/,/g, "/");

  } else {

    basePath = urlArray.slice(0);
    basePath.pop();

    basePath = basePath.toString();
    basePath = basePath.replace(/,/g, "/");

    urlString = urlArray.toString();
    req.url = urlString.replace(/,/g, "/");
  }

  req.url = req.url + "/";
  basePath = basePath + "/";

  // <!-- end of remove pagination

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

  console.log("start is " + start);

  // Pagination Logic Part I of II Ends Here

  // `select * from results where Template = '${template}' and where Language = '${language}' and where Result = '${result}';`
  db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Result = '${testResult}' AND Output like '%${custom}%' limit ${start}, ${rowsToReturn};`).then(results => {

    // Obtain Total Count from results
    db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Result = '${testResult}' AND Output like '%${custom}%'`).then(count => {

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

      // Modify search query on ec2 to obtain correct result.
      custom = custom.replace(/%/g, " ");

      res.render('results_custom', {
        title: 'Results with Query: ' + custom,
        start: start,
        end: end,
        page: page,
        pages: pages,
        results: results,
        template: template,
        language: language,
        length: total,
        currentUrl: req.url,
        basePath: basePath,
        pfsUrl: pfsUrl
      });

      return null;

    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })
    return null;

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })

};

// from express.js:
// app.get('/results/:locale/testresult/:testResult', api_results.getResultByLangAndTestResult);
exports.getResultByLangAndTestResult = function(req, res) {

    console.log("I am the walrus.");

    var features = [];
    let language = req.params.locale;
    let testResult = req.params.testresult;
    let urlString = null;
    let basePath = null;

    // Remove Pagination from current url variable
    // Additionally, obtain base path from current url.

    let pfsUrl = null;
    pfsUrl = `/results/locale/${language}/testresult/`;

    let urlArray = req.url.split("/");

    let regexNum = /^[0-9]*$/;

    if (urlArray[urlArray.length - 1].match(regexNum)) {

      urlArray.pop();

      basePath = urlArray.slice(0);
      basePath.pop();

      urlString = urlArray.toString();
      basePath = basePath.toString();
      basePath = basePath.replace(/,/g, "/");
      req.url = urlString.replace(/,/g, "/");

    } else {

      basePath = urlArray.slice(0);
      basePath.pop();

      basePath = basePath.toString();
      basePath = basePath.replace(/,/g, "/");

      urlString = urlArray.toString();
      req.url = urlString.replace(/,/g, "/");
    }

    req.url = req.url + "/";
    basePath = basePath + "/";

    // <!-- end of remove pagination

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
          db.sequelize.query(`SELECT * FROM Result WHERE Language = '${language}' AND Result = '${testResult}' limit ${start}, ${rowsToReturn};`).then(results => {

            // Obtain Total Count from results
            db.sequelize.query(`select count(*) from Result WHERE Language = '${language}' AND Result = '${testResult}'`).then(count => {

                            // Obtain Total count from query
              let Totalcount = count[0];

              Totalcount = JSON.stringify(count[0]);

              Totalcount = Totalcount.replace("[{\"count(*)\":", "");
              Totalcount = Totalcount.replace("}]", "");
              Totalcount = parseInt(Totalcount);

              results = results[0];


              // Needed To convert the blob object into a string 
              // Otherwise it returns a buffer array object.
              for (var i = 0; i < results.length; i++) {
                results[i].Output = String(results[i].Output);

              }

              let total = Totalcount;

              // Pagination Logic Part II Begins Here
              // Get total number of pages
              let pages = Math.ceil(total / rowsToReturn);

              end = start + results.length

              if (page === 0) {
                page = 1;
              } else {
                ++page;

              }

              // Pagination Logic Part II Ends Here
              res.render('results_custom', {
                title: 'Test Result: ' + testResult,
                start: start,
                end: end,
                page: page,
                pages: pages,
                template: 'All',
                features: features,
                language: language,
                results: results,
                length: total,
                currentUrl: req.url,
                basePath: basePath,
                pfsUrl,
                pfsUrl

              });

              return null;

            }).catch(function(err) {
              console.log('error: ' + err);
              return err;
            })

            return null;

          }).catch(function(err) {
            console.log('error: ' + err);
            return err;
          })

        };

        //app.get('/results/feature/:template/locale/:locale/query/:custom/testresult/:testresult/', api_results.getResultByIdLanguageCustomTestResult)

        exports.getResultByIdLanguageCustomTestResult = function(req, res) {

          let template = req.params.template;
          let language = req.params.locale;
          let testResult = req.params.testresult;
          let custom = req.params.custom;
          let urlString = null;
          let basePath = null;

          // Remove Pagination from current url variable
          // Additionally, obtain base path from current url.

          let pfsUrl = null;
          pfsUrl = `/results/feature/${template}/locale/${language}/query/${custom}/testresult/`;
          pfsUrl = pfsUrl.replace(/%/g, " ");

          // remove special characters from pfsUrl

          console.log("I am now the new walrus.");

          let urlArray = req.url.split("/");

          let regexNum = /^[0-9]*$/;

          if (urlArray[urlArray.length - 1].match(regexNum)) {

            urlArray.pop();

            basePath = urlArray.slice(0);
            basePath.pop();


            urlString = urlArray.toString();
            basePath = basePath.toString();
            basePath = basePath.replace(/,/g, "/");
            req.url = urlString.replace(/,/g, "/");

          } else {

            basePath = urlArray.slice(0);
            basePath.pop();

            basePath = basePath.toString();
            basePath = basePath.replace(/,/g, "/");

            urlString = urlArray.toString();
            req.url = urlString.replace(/,/g, "/");
          }

          req.url = req.url + "/";
          basePath = basePath + "/";

          // <!-- end of remove pagination

          // Modify search query on ec2 to obtain correct result.
          custom = custom.replace(/ /g, "%");

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
          db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testResult}' AND Output = '%${custom}%' limit ${start}, ${rowsToReturn};`).then(results => {

            // Obtain Total Count from results
            db.sequelize.query(`select count(*) from Result WHERE Template = '${template}' AND Language = '${language}' AND Result = '${testResult}' AND Output = '%${custom}%'`).then(count => {

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

              // Modify search query on ec2 to obtain correct result.
              custom = custom.replace(/ /g, "%");

              res.render('results_custom', {
                title: 'Test Results:',
                start: start,
                end: end,
                page: page,
                pages: pages,
                results: results,
                template: template,
                language: language,
                length: total,
                currentUrl: req.url,
                basePath: basePath,
                pfsUrl: pfsUrl
              });
              return null;

            }).catch(function(err) {
              console.log('error: ' + err);
              return err;

            })
            return null;

          }).catch(function(err) {
            console.log('error: ' + err);
            return err;

          })
        };
