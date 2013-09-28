var crypto = require('crypto'),
    User = require('../models/user.js');

/**
 * set routers
 */

// get function
var index = function(req, res) {
  res.render('index', {
    title: '首页',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

var login = function(req, res) {
  res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success'),
      error: req.flash('error')
  });
};

var reg = function(req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

var post = function(req, res) {
  res.render('post', {title: '发布'});
};

// post function

var doLogin = function(req, res) {
  var name = req.body.name,
      password = req.body.password,
      md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');
  User.get(name, function(err, user) {
    if(user) {
      if(password === user.password) {
        req.session.user = user;
        req.flash('success', '登录成功!');
        return res.redirect('/');
      } else {
        req.flash('error', '密码不正确!');
      }
    } else {
      req.flash('error', '用户不存在!');
    }
    res.redirect('/login');
  })
};

var doReg = function(req, res) {
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
    console.log(user);
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

var doPost = function(req, res) {

};

var doLogout = function(req, res) {

};

module.exports = function(app) {
  app.get('/', index);
  app.get('/login', login);
  app.get('/reg', reg);
  app.get('/post', post);

  app.post('/login', doLogin);
  app.post('/reg', doReg);
  app.post('/post', doPost);
  app.post('/logout', doLogout);
};