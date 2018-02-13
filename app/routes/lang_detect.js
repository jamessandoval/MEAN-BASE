'use strict';

//https://github.com/dachev/node-cld
var cld = require('cld');

var express = require('express');
var router = express.Router();


// Return a translation detection result based on a post request.
router.post('/', function(req, res) {  

  var text = req.body.text;

  console.log(text);

  var result = cld.detect(text, function(err, result){

      if(err){
        res.send(err)
      }else{

         res.send(result);        
      }
  })

});

module.exports = router;
