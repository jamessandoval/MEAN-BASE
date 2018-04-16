'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Excel = require('exceljs');
const streamify = require('stream-array');
const os = require('os');

// Read Excel File Data
const fs = require('fs');
const path = require('path');

//### NEED to find out correct path
let rootPath = path.normalize(__dirname + '../../../');
rootPath = rootPath + 'temp_directory';

/*######################################
##
## Check to see if a process is running
## Uses promises and a call to system 
## PS grep "keyword to check if running"
## Parameters 
##
## 1. ProcessName ie. java
## 2. nameToMatch ie. selenium
##
####################################### */

function checkProcessByName(processName, nameToMatch) {
  return new Promise(function(resolve, reject) {
    let processList = new Array();

    const { spawn } = require('child_process');
    const ps = spawn('ps', ['ax']);
    const grep = spawn('grep', [processName]);

    ps.stdout.on('data', (data) => {
      grep.stdin.write(data);
    });

    ps.stderr.on('data', (data) => {
      console.log(`ps stderr: ${data}`);
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        console.log(`ps process exited with code ${code}`);
      }
      grep.stdin.end();
    });

    // get output 
    grep.stdout.on('data', (data) => {
      let output = data.toString();
      processList.push(output);

    });

    grep.stderr.on('data', (data) => {
      console.log(`grep stderr: ${data}`);
    });

    grep.on('close', (code) => {

      let matchFlag = 0;

      for (var i = 0; i < processList.length; i++) {

        if (processList[i].includes(nameToMatch)) {
          matchFlag += 1;
        }
      }
      if (matchFlag) {
        //console.log("We really have a match");	
        resolve("success");
      } else {
        reject("fail");
      }

    });
  })
}

function startProcess(processToStart) {

  //
  // Startup process to start if not running
  //

  if (processToStart === "selenium") {
    let spawn = require('child_process').spawn,
      script = spawn('selenium-standalone', ['start'], { detached: true });

    script.stderr.on('data', (data) => {
      console.log(`ps stderr: ${data}`);
    });

    script.on('close', (code) => {
      if (code !== 0) {
        console.log(`start Script process exited with code ${code}`);
      }
      script.stdin.end();
    });

    //
    // Startup phantom js if not running
    //
  } else if (processToStart === "phantomjs") {

    let spawn = require('child_process').spawn,
      script = spawn('phantomjs', ['--webdriver=8643'], { detached: true });

    script.stderr.on('data', (data) => {
      console.log(`ps stderr: ${data}`);
    });

    script.on('close', (code) => {
      if (code !== 0) {
        console.log(`start Script process exited with code ${code}`);
      }
      script.stdin.end();
    });
  }
}

function checkEnvironmentSettings() {

  return new Promise(function(resolve, reject) {

    let process1 = "selenium";
    let keyword1 = "java";
    let process2 = "phantomjs";
    let keyword2 = "phantom";

    let statusObject = {
      phantom: "on",
      selenium: "on"
    };

    // Check to see if Selenium is Running
    // Start Selenium if not running 	

    checkProcessByName(keyword1, process1).then(response => {

      console.log("process: " + process1 + " is running");

    }).catch(function(response) {

      console.log("selenium is not running...starting");

      startProcess(process1);

    });

    // Check to see if Phantom js running 

    checkProcessByName(keyword2, process2).then(response => {

      console.log("process: " + process2 + " is running");

    }).catch(function(response) {

      console.log("phantomjs is not running...starting");

      startProcess(process2);

    });

    if (statusObject.phantom == "off" && statusObject.selenium == "off") {

      reject(statusObject);
    } else {

      resolve(statusObject);
    }
  })

};

// OLD Export tool
exports.getOverview = function(req, res) {

  checkEnvironmentSettings().then(statusObject => {

    res.render('dropdownTestRunner', {
      title: 'Run Tests',
      driverStatus: statusObject,
      user: req.user.firstname

    });

  })

};



// Promise example ::


/*

function checkProcessByName(processName, nameToMatch) {
  return new Promise(function(resolve, reject) {


  	getData(someValue, function(error, result){





  		















            if(error){
                reject(error);
            }
            else{
                resolve(result);
            }
        })






  })



*/
