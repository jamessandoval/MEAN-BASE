
'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var db = {};

var rootPath = path.normalize(__dirname + '/..');
var modelsDir = rootPath + '/app/models';
// create your instance of sequelize

var sequelize = new Sequelize('mean', 'root', 'root', {
        host: 'localhost',
        port: '3306',
        dialect: 'mysql',

        pool: {
			max: 5,
		 	min: 0,
		  	acquire: 30000,
		  	idle: 10000
		}
});

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    // import model files and save model names
    .forEach(function (file) {
        winston.info('Loading model file ' + file);
        var model = sequelize.import(path.join(modelsDir, file));
        db[model.name] = model;
    });

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db)
    }
});

// assign the sequelize variables to the db object and returning the db. 
module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);


