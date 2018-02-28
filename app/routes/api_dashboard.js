// Invoke 'strict' JavaScript mode
'use strict';

// Create a new 'render' controller method
exports.render = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard',
    pass: '1000',
    fail: '100',
    skip: '150',
    passesArray: '[22, 3, 12]',
    failsArray:  '[22, 3, 12]',
    othersArray: '[4,23,10]'
  });
};
