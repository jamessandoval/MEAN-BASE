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
