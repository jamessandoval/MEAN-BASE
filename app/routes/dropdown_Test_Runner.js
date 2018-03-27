// Invoke 'strict' JavaScript mode
'use strict';


const db = require('../../config/sequelize');
const Sequelize = require('sequelize');


exports.getOverview = function(req, res) {

  res.render('dropdownTestRunner', {
    title: 'Test Runner 2'
  });
}
