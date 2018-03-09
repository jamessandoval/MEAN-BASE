'use strict';

exports.getHome = function(req, res) {

  res.render('home', {
    title: 'Home Page',
    currentUrl: req.url
  });

};
