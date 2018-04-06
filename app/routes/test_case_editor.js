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

