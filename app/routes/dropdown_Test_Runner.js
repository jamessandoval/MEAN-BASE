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


// OLD Export tool
exports.getOverview = function(req, res) {

    res.render('dropdownTestRunner', {
      title: 'Run Tests',
      // features: features,
      // languages: languages,
      user: req.user.firstname

    });

};

