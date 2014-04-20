exports.checkLogin = function(req, res, next) {
  if(!req.session.user) {
    req.flash('error', '请登录!');
    res.redirect('/login');
  }
  next();
};

exports.checkNotLogin = function(req, res, next) {
  if(req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');
  }
  next();
};

exports.checkSupperAdmin = function(req, res, next) {
  if(req.session.user.name !== 'applesstt') {
    req.flash('error', '您不是管理员！');
    res.redirect('back');
  }
  next();
};