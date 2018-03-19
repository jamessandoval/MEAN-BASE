'use strict';

var db = require('../../config/sequelize');

exports.getExport = function(req, res) {

  db.Result.findAll().then(results => {

    var features = [];
    var languages = [];

    // Needed To convert the blob object into a string 
    // Otherwise it returns a buffer array object.
    for (var i = 0; i < results.length; i++) {
      results[i].Output = String(results[i].Output);

      // Save each unique template
      if (!features.includes(results[i].Template)) {
        features.push(results[i].Template);
      }

      // Save Each unique Language
      if (!languages.includes(results[i].Language)) {
        languages.push(results[i].Language);
      }
    }

    res.render('export', {
      title: 'Export Tool',
      features: features,
      languages: languages
    });
  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
};
