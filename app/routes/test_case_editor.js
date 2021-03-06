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

            console.log(results[1].Gherkin);

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

exports.newGherkin = function (req, res) {

    let jsonObject = JSON.stringify(req.body);
    let CompleteGherkin = (req.body[0].theScenario + req.body[0].theGherkin);

    db.sequelize.query(`SELECT * FROM TestCase;`).then(gherkinData => {  // TestCase table has: TestCaseId, HashValue, TestCaseDescription, Live, Gherkin
        var gherkinData = gherkinData[0];
        db.sequelize.query('SELECT * FROM Template;').then(whereUsed => { //Template has: Id, TestCaseId ->     f1 - 1,2,3,4,

            if(req.body[0].theID == ""){  // if there wasn't an ID, create the new test case
                db.sequelize.query("INSERT INTO TestCase (HashValue,TestCaseDescription,Live,Gherkin,IsFunctionalTest) VALUES ('" + gherkinData.length +"-new', '" + req.body[0].theScenario + "' , 1 , '" + CompleteGherkin + "', '" + req.body[0].isItChecked + "');" ).then(newTestCase =>{
                    console.log("this is the new test case id " + newTestCase[0]);
                    var newId = newTestCase[0];   
                    newId = JSON.stringify(newId);     
                    res.send(newId);

                }).catch(function(err) {
                    console.log('error: ' + err);
                    return err;
                })
            }   
        }).catch(function(err) {
            console.log('error: ' + err);
            return err;
        })
        
    }).catch(function(err) {
        console.log('error: ' + err);
        return err;
    })
}


exports.postGherkin = function(req, res) {  // the user clicked on "Save Edits"
    console.log("here I am");
    let jsonObject = JSON.stringify(req.body);
    console.log(jsonObject);

    db.sequelize.query(`SELECT * FROM TestCase;`).then(gherkinData => {  // TestCase table has: TestCaseId, HashValue, TestCaseDescription, Live, Gherkin
        db.sequelize.query('SELECT * FROM Template;').then(whereUsed => { //Template has: Id, TestCaseId ->     f1 - 1,2,3,4,
            gherkinData = gherkinData[0];
            whereUsed = whereUsed[0];
            let CompleteGherkin = (req.body[0].theScenario + req.body[0].theGherkin);

            //****************TO BE WORKED ON - HAVE TO WRITE TO DATABASE AFTER CHECKING HASHTAG VALUE****************
            //     --------------------------------------------TEST TO SEE IF THE GHERKIN IS IN THE DATABASE ALREADY - INCOMPLETE
            // for (var x = 0; x<gherkinData.length; x++){
            //     console.log(gherkinData[x].Gherkin); // this is the Gherkin in the database which includes the @javascript and Scenario parts
            //     if (gherkinData[x].Gherkin == CompleteGherkin){
            //         console.log("--------------------------------------found it ---------------------------");
            //     }
            // }
            
            console.log("got this far");
            //if there already IS an ID, we are updating the TestCase table
            db.sequelize.query("UPDATE TestCase SET HashValue = '" + req.body[0].theID + "-update', TestCaseDescription = '" + req.body[0].theScenario + "', Live = 1, Gherkin = '" +CompleteGherkin +"', IsFunctionalTest = '"+req.body[0].isItChecked+ "' WHERE TestCaseId = '" + req.body[0].theID + "'; "  ).catch(function(err) {
                console.log('error: ' + err);
                return err;
            })
            
            // From the Textareas - we get these varibles pushed through a POST request -
                // "theID": theCaseID, 
                // "theScenario": newScenario, 
                // "theGherkin": newGherkin, 
                // "newPages": newPagesArray,
                // "removals": removePagesArray,
                // "isItChecked": isItChecked
            
            // remove tests cases that would run on a template (remove them from the Template table)
            if(req.body[0].removals != null){
                for (var y = 0; y<req.body[0].removals.length; y++ ){//looping through the REMOVAL requests
                    for (var x = 0; x<whereUsed.length; x++){//looping through the database TEMPLATE TABLE
                        if (whereUsed[x].Id == req.body[0].removals[y]){
                            //grab the list of TESTCASEIDS , convert it to an array separated by commas, and pull out the theID -> then put the array back together and feed int into the TESTCASEID field in the Template table.
                            var caseArray = [];
                            caseArray = whereUsed[x].TestCaseId.split(",");
                            var whereIsIt = caseArray.indexOf(req.body[0].theID);
                            caseArray.splice(whereIsIt,1);
                            caseArray = caseArray.join(",");
                            console.log(caseArray);
                            db.sequelize.query("UPDATE Template SET TestCaseId = '" + caseArray + "' WHERE Id = '" + req.body[0].removals[y] + "'; "  ).catch(function(err) {
                                console.log('error: ' + err);
                                return err;
                            })
                        }
                    }
                }
            }
            // add test cases that would run on a template (add to the Template table)
            if(req.body[0].newPages != null){
                for (var y = 0; y<req.body[0].newPages.length; y++ ){//looping through the ADDITION requests
                    for (var x = 0; x<whereUsed.length; x++){//looping through the database TEMPLATE TABLE
                        if (whereUsed[x].Id == req.body[0].newPages[y]){
                            caseArray = whereUsed[x].TestCaseId.concat("," + req.body[0].theID);
                            console.log(caseArray);
                            db.sequelize.query("UPDATE Template SET TestCaseId = '" + caseArray + "' WHERE Id = '" + req.body[0].newPages[y] + "'; "  ).catch(function(err) {
                                console.log('error: ' + err);
                                return err;
                            })
                        }
                    }
                }
            }

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
