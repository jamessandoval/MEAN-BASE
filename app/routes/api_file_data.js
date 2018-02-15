'use strict';
var express = require('express');
var router = express.Router();

// Socket Expiremntation


var fs = require('fs');
var path = require('path');
var rootPath = path.normalize(__dirname + '../../..');
var rootPath = rootPath + '/behat_projects/master_tests';
const spawn = require('child_process').spawn;


// Get the file directory contents with the features you intend on running
router.get('/', function(req, res) {

  console.log(rootPath);

  fs.readdir(rootPath, function(err, items) {

    for (var i = items.length - 1; i >= 0; i--) {

      if (!items[i].match(/behat_run/)) {

        items[i]
        items.splice(i, 1);

      } else {

        items[i] = items[i].replace(/behat_run_/, '');
        items[i] = items[i].replace(/\.sh/, '');

      }
    }
    res.send({
      content: items
    });
  });
});


router.post('/', function(req, res) {

  // Process JSON Arguments
  var shell_script = req.body.exec;
  shell_script = "behat_run_" + shell_script + ".sh";

  var options = {
    cwd: rootPath
  }

  var spawn = require('child_process').spawn,
    script = spawn('sh', [shell_script], options);

  script.stdout.on('data', function(data) {
    console.log('stdout: ' + data.toString());
  });

  script.stderr.on('data', function(data) {
    console.log('stderr: ' + data.toString());
  });

  script.on('exit', function(code) {
    console.log('child process exited with code ' + code.toString());
  });

  res.redirect('/output');


  // Listen on socket
  io.on('connection', function(socket) {
    socket.on('output', function() {

      script.stdout.on('data', function(data) {
        var msg = data.toString();
        console.log(msg);
        socket.broadcast.emit('chat message',msg);
      });

      script.stderr.on('data', function(data) {
        var msg = data.toString();
        console.log(msg);
        socket.broadcast.emit('chat message',msg);
      });

      script.on('exit', function(code) {
        var msg = code.toString();
        console.log(msg);
        socket.broadcast.emit('chat message',msg);
      });
    });
  });
});

module.exports = router;


/*

##
## Example on Getting the pid
## 

/*

const { spawn } = require('child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();

*/
