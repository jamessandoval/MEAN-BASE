// Invoke 'strict' JavaScript mode
'use strict';


const db = require('../../config/sequelize');
const Sequelize = require('sequelize');


// Create a new 'render' controller method
exports.getOverview = function(req, res) {

  let feature = "ALL";
  let language = "ALL";
  let lang =[];


  let overall = {
  	pass: 0,
  	fail: 0,
  	skip: 0
  }


// select count(*) from results where result = 'PASS';
  db.sequelize.query(`select distinct Language from results;`).then(results => {

    results = results[0];

    //console.log(results[0].Language);

    lang=results;

    // select count(*) from results where result = 'PASS';
    db.sequelize.query(`select count(*) from results where result = 'PASS';`).then(results => {

      results = results[0];

      overall.pass = JSON.stringify(results[0]);
      overall.pass = overall.pass.replace("{\"count(*)\":", "");
      overall.pass = overall.pass.replace("}", "");
      overall.pass = parseInt(overall.pass);

      // Call next query:

      // select count(*) from results where result = 'FAIL';
      db.sequelize.query(`select count(*) from results where result = 'FAIL';`).then(results => {

        results = results[0];

        overall.fail = JSON.stringify(results[0]);
        overall.fail = overall.fail.replace("{\"count(*)\":", "");
        overall.fail = overall.fail.replace("}", "");
        overall.fail = parseInt(overall.fail);

        // select count(*) from results where result = 'SKIP';
        db.sequelize.query(`select count(*) from results where result = 'SKIP';`).then(results => {

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
            languagesArray: lang
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
  }).catch(function(err) {
    console.log('error: ' + err);
    return err;

  })

};

//app.get('/dashboard/custom/:custom', api_dashbboard.getResultMetaByCustom)

exports.getResultMetaByCustom = function(req, res) {


  let custom = req.params.custom;

  custom = "H1 in the correct language";

  let language = "all";
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
    db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'PASS' AND Output LIKE '%${custom}%'`).then(results => {

      results = results[0];

      pass = JSON.stringify(results[0]);
      pass = pass.replace("{\"count(*)\":", "");
      pass = pass.replace("}", "");
      pass = parseInt(pass);

      overall.pass += pass;

      // New value = pass

      // select count(*) from results where result = 'FAIL';
      db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'FAIL' AND Output LIKE '%${custom}%'`).then(results => {

        results = results[0];

        fail = JSON.stringify(results[0]);
        fail = fail.replace("{\"count(*)\":", "");
        fail = fail.replace("}", "");
        fail = parseInt(fail);

        overall.fail += fail;

        // New value = fail

        // select count(*) from results where result = 'SKIP';
        db.sequelize.query(`SELECT count(*) FROM results WHERE Template = '${features[i]}' AND result = 'SKIP' AND Output LIKE '%${custom}%'`).then(results => {

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
              title: 'Results with query: ' + custom ,
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

exports.getResultMetaByLocale = function(req, res) {

  let locale = req.params.locale;
  let language = locale;
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
