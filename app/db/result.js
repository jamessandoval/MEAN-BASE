// Result Queries

const db = require('../../config/sequelize');

exports.allNoPagination = function() {

  db.result.findAndCountAll().then(results => {

  
  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
}


exports.allWithPagination = function() {

  db.result.findAndCountAll(limit: 10, offset: 10).then()


}


/* GET ALL Results */
exports.all = function(req, res) {

  db.result.findAll().then(results => {

    // Needed To convert the blob object into a string 
    // Otherwise it returns a buffer array object.
    for (var i = 0; i < results.length; i++) {
      results[i].Output = String(results[i].Output);

    }

    res.send(results);

  }).catch(function(err) {
    console.log('error: ' + err);
    return err;
  });
}