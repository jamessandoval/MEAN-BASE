'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;


exports.editTestCases = function(req, res) {  //getResultByTemplateCustom

    let template = req.params.template;
    let language = "All";
    let total = null;
    let basePath = null;
    let urlString = null;
    let custom = req.params.custom;
    let testresult = null;
  
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
    db.sequelize.query(`SELECT * FROM Result WHERE Template = '${template}' AND Output like '%${custom}%' ORDER BY TestCaseId, URLs limit ${start}, ${rowsToReturn};`).then(results => {
  
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
          pfsUrl: pfsUrl,
          testresult: testresult,
          custom: custom,
          user: req.user.firstname
  
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