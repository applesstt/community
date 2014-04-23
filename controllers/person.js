var User = require('../models/user.js');

exports.toSet = function(req, res) {
  res.render('person/set', {
    title: '基本信息',
    user: req.session.user,
    env: req.session.env,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};

exports.doSet = function(req, res) {
  var img = req.body.img;
  var city = req.body.city;
  var website = req.body.website;
  var des = req.body.des;
  var user = req.session.user;
  user.img = img;
  user.city = city;
  user.website = website;
  user.des = des;
  var updateUser = new User(user);
  updateUser.update(function(err) {
    req.session.user = updateUser;
    req.flash('success', '成功修改个人信息!');
    res.redirect('/person');
  });
};