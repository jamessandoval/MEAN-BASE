'use strict';

const async = require('async');
const db = require('../../config/sequelize');


function getTestCasesAndUrlsFromDB() {  // was getTestProcessesFromDB

    return new Promise(function(resolve, reject) {
  
      async.parallel({
  
        testCases: function(cb) {
          db.sequelize.query(`select * from TestCase;`).then(allTCs => {
             allTCs = allTCs[0];
            // console.log(allTCs);
            cb(null, allTCs);
          });
        },
        
        allTheUrls: function(cb) {
          db.sequelize.query(`select * from Urls;`).then(allUrls => {
            let Urls = allUrls[0];
            cb(null, Urls);
          });
        }
      }, (err, results) => {
        if (results) {
          resolve(results);
        //   console.log(results);
        } else {
           reject(err);
        }
      });
    });
};


exports.modal = function(req, res) {

    getTestCasesAndUrlsFromDB().then(results => {

        // let theUrls = results.Urls;
        let theTCs = results.testCases;
        let theURLs = results.allTheUrls;

        res.render('runTestsModal', {
            title: 'Run Tests',
            currentUrl: req.url,
            tcs: theTCs,
            urls: theURLs

        });
    });
  };
  