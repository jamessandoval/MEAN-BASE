'use strict';

exports.getHome = function(req, res) {

  res.render('home', {
    title: 'Landing Page'
  });

};
