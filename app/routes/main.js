'use strict';

exports.getHome = function(req, res) {

  res.render('home', {
    title: 'Q.A. Automated Testing Suite',
    currentUrl: req.url
  });

};
