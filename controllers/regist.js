var User = require('../models/user.js');

exports.toReg = function(req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

exports.doReg = function(req, res) {
  var name = req.body.name,
    password = req.body.password,
    repeat_password = req.body.repeat_password,
    email = req.body.email;
  if(password !== repeat_password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/reg');
  }
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');
  var newUser = new User({
    name: name,
    password: password,
    email: email
  });
  User.get(name, function(err, user) {
    if(user) {
      req.flash('error', '该用户已存在!');
      return res.redirect('/reg');
    }
    newUser.save(function(err) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功!');
      res.redirect('/');
    });
  })
};