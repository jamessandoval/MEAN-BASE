// Invoke 'strict' JavaScript mode
'use strict';


const db = require('../../config/sequelize');
const Sequelize = require('sequelize');


// Create a new 'render' controller method
exports.render = function(req, res) {

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

        /*
        res.send({
          feature: feature,
          language: language,
          pass: pass,
          fail: fail,
          skip: skip
        });

        */

        res.render('dashboard', {
          title: 'Dashboard',
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

//`SELECT count(*) FROM results WHERE Template = ${features[i++]} AND result = '${result}' and Language = '${locale}';`)
exports.getResultMetaByLocale = function(req, res) {

  let locale = 'cn'; //req.params.locale;
  let features = ['F1', 'F2', 'F3', 'F4', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F15', 'F16', 'F17', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25'];
  let pass = null;
  let fail = null;
  let skip = null;

  let resultsTotal = [];

  let overall = {
    pass: 0,
    skip: 0,
    fail: 0
  };


  getResultsTotal(0);

  function getResultsTotal(i) {

    // select count(*) from results where result = 'PASS';
    db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'PASS' and Language = '${locale}'`).then(results => {

      results = results[0];

      pass = JSON.stringify(results[0]);
      pass = pass.replace("{\"count(*)\":", "");
      pass = pass.replace("}", "");
      pass = parseInt(pass);

      overall.pass += pass;

      // New value = pass

      // select count(*) from results where result = 'FAIL';
      db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'FAIL' and Language = '${locale}'`).then(results => {

        results = results[0];

        fail = JSON.stringify(results[0]);
        fail = fail.replace("{\"count(*)\":", "");
        fail = fail.replace("}", "");
        fail = parseInt(fail);

        overall.fail += fail;

        // New value = fail

        // select count(*) from results where result = 'SKIP';
        db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'SKIP' and Language = '${locale}'`).then(results => {

          results = results[0];

          skip = JSON.stringify(results[0]);
          skip = skip.replace("{\"count(*)\":", "");
          skip = skip.replace("}", "");
          skip = parseInt(skip);

          overall.skip += skip;

          // New value = skip

          // Now push to the array

          resultsTotal.push({
            locale: locale,
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
              title: 'Dashboard',
              resultsTotal : resultsTotal,
              overall: overall
            });

          } else {

            setTimeout(() => { getResultsTotal(i + 1); });
          }

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
  }
};

function getResultsTotal(features) {

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

        /*
        res.send({
          feature: feature,
          language: language,
          pass: pass,
          fail: fail,
          skip: skip
        });

        */

        res.render('dashboard', {
          title: 'Dashboard',
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
