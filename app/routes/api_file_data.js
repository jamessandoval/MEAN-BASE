'use strict';
var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var rootPath = path.normalize(__dirname + '../../../..');
var rootPath = rootPath + '/behat_projects/master_tests';
const exec = require('child_process').exec;

// Get the file directory contents with the features you intend on running
router.get('/', function(req, res) {
  fs.readdir(rootPath, function(err, items) {

    for (var i = items.length - 1; i >= 0; i--) {

      if(!items[i].match(/behat_run/)){

        items[i]
        items.splice(i, 1);

      }else{

        items[i] = items[i].replace(/behat_run_/, '');
        items[i] = items[i].replace(/\.sh/, '');

      }
    }
      res.send({
        content: items,
    });
  });
});


router.post('/', function(req, res) {

  var shell_script = req.body.exec;

  shell_script = "behat_run_" + shell_script + ".sh";

  console.log(shell_script);

  exec(rootPath+'/'+shell_script,(error, stdout, stderr) => {

    var output = `${stdout}`;
    console.log(output);

    console.log(`${stderr}`);

    res.send(output);

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














