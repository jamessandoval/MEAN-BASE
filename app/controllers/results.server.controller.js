// Invoke 'strict' JavaScript mode

'use strict';
var db = require('../../config/sequelize');

/**
 * List of Articles
 */

exports.render = function(req, res) {
	db.results.findAll().then(results => {
  		//console.log(results)

  		res.render('results', {
  			results: results,
			title: 'This is results page'
		});
	}).catch(function(err){
    	console.log('error: ' + err);
        console.log("This is where the error is." + err);
        return res.render('error', {
        	title: "Database Query Error.",
       		error: err,
       		status: 500
        });
    });
}
