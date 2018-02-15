'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

  // Features is an arrays
  res.render('index', {
  	title: 'Main Page'
  });
});

module.exports = router;