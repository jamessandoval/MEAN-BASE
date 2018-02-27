// Invoke 'strict' JavaScript mode
'use strict';

// Create a new 'render' controller method
exports.render = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard',
    pass: '1000',
    fail: '100',
    skip: '150'
  });
};
