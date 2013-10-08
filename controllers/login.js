exports.toLogin = function(req, res) {
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

exports.doLogin = function(req, res) {
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

exports.logout = function(req, res) {
  req.session.user = null;
  req.flash('success', '成功退出!');
  res.redirect('/');
};