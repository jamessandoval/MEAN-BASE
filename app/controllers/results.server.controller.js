// Invoke 'strict' JavaScript mode

'use strict';
var db = require('./models');

/**
 * List of Articles
 */
exports.render = function(req, res) {
    console.log('this is the db.result model' + db.Result);
    db.Result.findAll({include: [{model:db.results, attributes: ['Template', 'Result', 'URLs', 'Output']}]}).then(function(results){   
        console.log(results);

        res.render('index', {
		title: 'Results Page'
		});
        //return res.jsonp(results);
    }).catch(function(err){
    	console.log('error: ' + err);
        //console.log("This is where the error is." + err);
        //return res.render('error', {
        //	console.log()
        //    error: err,
        //    status: 500
        //});
    });
};