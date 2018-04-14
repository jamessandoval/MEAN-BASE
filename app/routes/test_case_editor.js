'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;


exports.editTestCases = function(req, res) {  //getResultByTemplateCustom

    let testcases=null;
    let results = null;
  
    db.sequelize.query(`SELECT * FROM Template;`).then(whereUsed => {  //pulling in data on where each test case is used (in which templates)

        db.sequelize.query(`SELECT * FROM TestCase;`).then(results => {

            results = results[0];
            whereUsed= whereUsed[0];



            res.render('test_case_editor', {
                title: 'Test Case Editor',
                testcases: results,
                template: whereUsed
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




  exports.postGherkin = function(req, res) {

    let jsonObject = JSON.stringify(req.body);
    console.log(jsonObject);
  
    db.sequelize.query(`SELECT * FROM TestCase;`).then(gherkinData => {  // TestCase table has: TestCaseId, HashValue, TestCaseDescription, Live, Gherkin
        db.sequelize.query('SELECT * FROM Template;').then(whereUsed => { //Template has: Id, TestCaseId - f1 - 1,2,3,4,test casese, etc
    

    

    // let currentTime = dateFormat(now, "ddddmmmmdSyyyyhMMsslTT");
  
    // let directory = behat_path + "/tmp/" + currentTime;
  
    // fs.mkdir(directory, function(err) {
    //   if (err) {
    //     console.log('failed to create directory', err);
    //   } else {
    //     fs.writeFile(directory + "/temp.json", jsonTestparams, function(err) {
    //       if (err) {
    //         console.log('error writing file', err);
    //       } else {
  
    //         let jsonPath = directory + "/temp.json";
  
    //         console.log(jsonPath);
  
    //         console.log('writing file succeeded');
  
    //         req.jsonpath = jsonPath;
  
    //         res.send("We did it!  We used POST and got a reponse!");
    //       }
    //     });
    //   }
    // });

        }).catch(function(err) {
            console.log('error: ' + err);
            return err;
        })
        return null;

    }).catch(function(err) {
        console.log('error: ' + err);
        return err;
    })

    res.send("We did it!  We used POST and got a reponse!");
  }