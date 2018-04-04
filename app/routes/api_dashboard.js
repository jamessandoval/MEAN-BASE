// Invoke 'strict' JavaScript mode
'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');

// Create a new 'render' controller method
exports.getOverview = function(req, res) {

  let feature = "ALL";
  let language = "ALL";
  let lang = [];
  let allDate = [];
  let statusDates = null;
  let testPassId = null;

  let overall = {
    pass: 0,
    fail: 0,
    skip: 0
  }

  // 1st Get latest test Pass id
  // If test Pass Id not passed as query string, get latest default

  if (!req.query.testpassid) {

    db.sequelize.query(`select TestPassId from Status where EndTime is not NUll order by RunDate limit 1;`).then(testPassId => {

      testPassId = testPassId[0][0].TestPassId;

      GetResultOverview(testPassId);

    });

  } else {

    testPassId = req.query.testpassid;
    GetResultOverview(testPassId);

  }


  function GetResultOverview(testPassId) {

    db.sequelize.query(`select distinct Language from Result where TestPassID = ${testPassId};`).then(results => {

      results = results[0];

      //console.log(results[0].Language);

      lang = results;

      // Select Run Dates from Status
      db.sequelize.query('select TestPassID, RunDate from Status').then(results => {

        results = results[0];

        statusDates = results;

        // select count(*) from results where result = 'PASS';
        db.sequelize.query(`select count(*) from Result where Result = 'PASS' and TestPassID = ${testPassId};`).then(results => {

          results = results[0];

          overall.pass = JSON.stringify(results[0]);
          overall.pass = overall.pass.replace("{\"count(*)\":", "");
          overall.pass = overall.pass.replace("}", "");
          overall.pass = parseInt(overall.pass);

          // Call next query:

          // select count(*) from results where result = 'FAIL';
          db.sequelize.query(`select count(*) from Result where Result = 'FAIL' and TestPassID = ${testPassId};`).then(results => {

            results = results[0];

            overall.fail = JSON.stringify(results[0]);
            overall.fail = overall.fail.replace("{\"count(*)\":", "");
            overall.fail = overall.fail.replace("}", "");
            overall.fail = parseInt(overall.fail);

            // select count(*) from results where result = 'SKIP';
            db.sequelize.query(`select count(*) from Result where Result = 'SKIP' and TestPassID = ${testPassId};`).then(results => {

              results = results[0];

              overall.skip = JSON.stringify(results[0]);
              overall.skip = overall.skip.replace("{\"count(*)\":", "");
              overall.skip = overall.skip.replace("}", "");
              overall.skip = parseInt(overall.skip);

              res.render('dashboard', {
                title: 'Dashboard',
                feature: feature,
                language: language,
                overall: overall,
                resultsTotal: null,
                languagesArray: lang,
                currentUrl: req.url,
                user: req.user.firstname,
                statusDates: statusDates,
                testPassId: testPassId

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

      return null;
    }).catch(function(err) {
      console.log('error: ' + err);
      return err;

    })

  }

};

//app.get('/dashboard/custom/:custom', api_dashbboard.getResultMetaByCustom)

exports.getResultMetaByCustom = function(req, res) {

  let custom = req.params.custom;

  // Modify search query on ec2 to obtain correct result.
  custom = custom.replace(/ /g, "%");


  let language = "all";
  let features = ['F1', 'F2', 'F3', 'F4', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F15', 'F16', 'F17', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25'];
  let pass = null;
  let fail = null;
  let skip = null;
  let statusDates = null;
  let testPassId = null;

  let resultsTotal = [];

  let overall = {
    pass: 0,
    skip: 0,
    fail: 0
  };

  // 1st Get latest test Pass id
  // If test Pass Id not passed as query string, get latest default

  if (!req.query.testpassid) {

    db.sequelize.query(`select TestPassId from Status where EndTime is not NUll order by RunDate limit 1;`).then(testPassId => {

      testPassId = testPassId[0][0].TestPassId;

      getResultsTotal(0, testPassId);

    });

  } else {

    testPassId = req.query.testpassid;
    getResultsTotal(0, testPassId);

  }

  //function GetResultOverview(testPassId) {

  function getResultsTotal(i, testPassId) {

    // select count(*) from results where result = 'PASS';
    db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'PASS' AND Output LIKE '%${custom}%' AND TestPassID = ${testPassId};`).then(results => {

      results = results[0];

      pass = JSON.stringify(results[0]);
      pass = pass.replace("{\"count(*)\":", "");
      pass = pass.replace("}", "");
      pass = parseInt(pass);

      overall.pass += pass;

      db.sequelize.query('select TestPassID, RunDate from Status').then(results => {

        results = results[0];

        statusDates = results;

        // New value = pass

        // select count(*) from results where result = 'FAIL';
        db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'FAIL' AND Output LIKE '%${custom}%' AND TestPassID = ${testPassId};`).then(results => {

          results = results[0];

          fail = JSON.stringify(results[0]);
          fail = fail.replace("{\"count(*)\":", "");
          fail = fail.replace("}", "");
          fail = parseInt(fail);

          overall.fail += fail;

          // New value = fail

          // select count(*) from results where result = 'SKIP';
          db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'SKIP' AND Output LIKE '%${custom}%' AND TestPassID = ${testPassId};`).then(results => {

            results = results[0];

            skip = JSON.stringify(results[0]);
            skip = skip.replace("{\"count(*)\":", "");
            skip = skip.replace("}", "");
            skip = parseInt(skip);

            overall.skip += skip;

            // New value = skip

            // Now push to the array

            resultsTotal.push({
              language: language,
              feature: features[i],
              pass: pass,
              fail: fail,
              skip: skip
            })

            if (i === features.length - 1) {

              //console.log(resultsTotal);
              //res.send(resultsTotal);
              //res.send(overall);

              // Remove % marks for output to page
              custom = custom.replace(/%/g, " ");

              res.render('dashboard', {
                language: language,
                feature: "all",
                title: 'Results with query: ' + custom,
                resultsTotal: resultsTotal,
                overall: overall,
                currentUrl: req.url,
                user: req.user.firstname,
                statusDates: statusDates,
                testPassId: testPassId,
                testPassId: testPassId

              });

            } else {

              setTimeout(() => { getResultsTotal(i + 1, testPassId); });
            }
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
  }
};

exports.getResultMetaByLocale = function(req, res) {

  let locale = req.params.locale;
  let language = locale;
  let features = ['F1', 'F2', 'F3', 'F4', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25'];
  let pass = null;
  let fail = null;
  let skip = null;
  let allDate = null;
  let statusDates = null;
  let testPassId = null;

  let resultsTotal = [];

  let overall = {
    pass: 0,
    skip: 0,
    fail: 0
  };

  // 1st Get latest test Pass id
  // If test Pass Id not passed as query string, get latest default

  if (!req.query.testpassid) {

    db.sequelize.query(`select TestPassId from Status where EndTime is not NUll order by RunDate limit 1;`).then(testPassId => {

      testPassId = testPassId[0][0].TestPassId;

      getResultsTotal(0, testPassId);

    });

  } else {

    testPassId = req.query.testpassid;
    getResultsTotal(0, testPassId);

  }

  function getResultsTotal(i, testPassId) {

    // select count(*) from results where result = 'PASS';
    db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'PASS' and Language = '${locale}' AND TestPassID = ${testPassId};`).then(results => {

      results = results[0];

      pass = JSON.stringify(results[0]);
      pass = pass.replace("{\"count(*)\":", "");
      pass = pass.replace("}", "");
      pass = parseInt(pass);

      overall.pass += pass;


      db.sequelize.query('select TestPassID, RunDate from Status').then(results => {

        results = results[0];

        statusDates = results;

        // select count(*) from results where result = 'FAIL';
        db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'FAIL' and Language = '${locale}' AND TestPassID = ${testPassId};`).then(results => {

          results = results[0];

          fail = JSON.stringify(results[0]);
          fail = fail.replace("{\"count(*)\":", "");
          fail = fail.replace("}", "");
          fail = parseInt(fail);

          overall.fail += fail;

          // New value = fail

          // select count(*) from results where result = 'SKIP';
          db.sequelize.query(`SELECT count(*) FROM Result WHERE Template = '${features[i]}' AND Result = 'SKIP' and Language = '${locale}' AND TestPassID = ${testPassId};`).then(results => {

            results = results[0];

            skip = JSON.stringify(results[0]);
            skip = skip.replace("{\"count(*)\":", "");
            skip = skip.replace("}", "");
            skip = parseInt(skip);

            overall.skip += skip;

            // New value = skip

            // Now push to the array

            resultsTotal.push({
              language: language,
              feature: features[i],
              pass: pass,
              fail: fail,
              skip: skip
            })

            if (i === features.length - 1) {

              //console.log(resultsTotal);
              //res.send(resultsTotal);
              //res.send(overall);

              res.render('dashboard', {
                language: language,
                feature: "all",
                title: 'Results by Language',
                resultsTotal: resultsTotal,
                overall: overall,
                currentUrl: req.url,
                user: req.user.firstname,
                statusDates: statusDates,
                testPassId: testPassId

              });

            } else {

              setTimeout(() => { getResultsTotal(i + 1, testPassId); });
            }

            return null;

          }).catch(function(err) {
            console.log('error: ' + err);
            return err;

          })

          return null;

        }).catch(function(err) {
          console.log('error: ' + err);
          return err;

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
  }
};
