// test Status

'use strict';

const db = require('../../config/sequelize');
const Sequelize = require('sequelize');
const async = require('async');
const util = require('util');
const dateFormat = require('dateformat');
const spawn = require('child_process').spawn;
// Read Excel File Data
const fs = require('fs');
const path = require('path');


//### NEED to find out correct path
var rootPath = path.normalize(__dirname + '../../../');
var rootPath = rootPath + '/behat_projects/master_tests';

function broadcastData(req, res, dataString) {

  const io = req.app.get('socketio');

  io.on('connection', function(client) {
  	
    console.log('Connection to client established');

    client.emit('message', dataString);
    client.emit('message', "hello frank");

    // Success!  Now listen to messages to be received
    client.on('connection', function(event) {
      console.log('Received message from client!', event);
    });

    client.on('disconnect', function() {
      console.log('Server has disconnected');
    });
  });

}


exports.getTestStatus = function(req, res) {

  async.parallel({

    status: function(cb) {

      db.sequelize.query(`SELECT * from status ORDER BY TestPassId DESC;`).then(status => {

        status = status[0];

        for (var i = 0; i < status.length; i++) {

          //results[i].Output = String(results[i].Output);
          status[i].RunDate = dateFormat(status[i].RunDate, "mmm dS, yyyy, h:MM:ss TT"); // + " PST";

          status[i].StartTime = dateFormat(status[i].StartTime, "mmm dS, yyyy, h:MM:ss TT"); // + " PST";

          if (status[i].EndTime) {
            status[i].EndTime = dateFormat(status[i].EndTime, "mmm dS, yyyy, h:MM:ss TT"); // + " PST";
          } else {

            status[i].EndTime = "TERMINATED";
          }
        }

        cb(null, status);
      });
    },
    testPass: function(cb) {

      db.TestPass.findAll().then(testPass => {

        cb(null, testPass);
      });
    }

  }, (err, results) => {

    res.render('test_status', {

      status: results.status,
      testPass: results.testPass

    })

  });
}

exports.getProcesses = function(req, res) {

  // Option all 
  let ps = spawn('ps', ['a']);

  let grep = spawn('grep', ['start']);

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

  grep.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  grep.stderr.on('data', (data) => {
    console.log(`grep stderr: ${data}`);
  });

  grep.on('close', (code) => {
    if (code !== 0) {
      console.log(`grep process exited with code ${code}`);
    }
  });

  res.send("process complete.");

}


exports.startProcess = function(req, res) {

    /* Expiremental Spawn Process Behavior */
    let options = {
      cwd: rootPath
    }

    let spawn = require('child_process').spawn,
      script = spawn('perl', ['start.pl', 'f1', 'en-us', 1], options);

      console.log("The pid is " + script.pid);

    // get output 
    script.stdout.on('data', (data) => {
      //script.stdin.write(data);
    	let dataString = String(data)
    	console.log(dataString);
        broadcastData(req, res, dataString);

    });

    script.stderr.on('data', (data) => {
      console.log(`ps stderr: ${data}`);
    });

    script.on('close', (code) => {
      if (code !== 0) {
        console.log(`start Script process exited with code ${code}`);
      }
      script.stdin.end();
    });

    console.log("end of function");

    /* Expiremental Spawn Process Behavior */

  res.send("start process complete.");

}
