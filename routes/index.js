var auth = require('../controllers/auth.js'),
  home = require('../controllers/home.js'),
  login = require('../controllers/login.js'),
  regist = require('../controllers/regist.js'),
  article = require('../controllers/article.js'),
  mail = require('../controllers/mail.js'),
  user = require('../controllers/user.js');

var SetRouter = (function() {
  var _app;

  var set = function(url, fun, type, isLogin, isNotLogin) {
    isNotLogin = typeof isNotLogin === 'undefined' ? false : !!isNotLogin;
    isLogin = typeof isLogin === 'undefined' ? false : !!isLogin;
    type = typeof type === 'undefined' ? 'get' : type;
    if(isNotLogin) {
      _app[type](url, auth.checkNotLogin);
    } else if(isLogin) {
      _app[type](url, auth.checkLogin);
    }
    _app[type](url, fun);
  };

  var init = function(app) {
    _app = app;
  };
  return {
    init: init,
    set: set
  }
}).call(this);

module.exports = function(app) {
  SetRouter.init(app);
  SetRouter.set('/', home.toHome, 'get');

  SetRouter.set('/login', login.toLogin, 'get', false, true);
  SetRouter.set('/login', login.doLogin, 'post', false, true);

  SetRouter.set('/reg', regist.toReg, 'get', false, true);
  SetRouter.set('/reg', regist.doReg, 'post', false, true);

  SetRouter.set('/post', article.toPost, 'get', true);
  SetRouter.set('/post', article.doPost, 'post', true);
  SetRouter.set('/uploadImage', article.doUploadImage, 'post', true);

  SetRouter.set('/u/:name', user.toUser, 'get');
  SetRouter.set('/u/:name/:day/:title', article.toView, 'get');
  SetRouter.set('/u/:name/:day/:title', article.doComment, 'post');

  SetRouter.set('/edit/:name/:day/:title', article.toUpdate, 'get', true);
  SetRouter.set('/edit/:name/:day/:title', article.doUpdate, 'post', true);

  SetRouter.set('/remove/:name/:day/:title', article.remove, 'get', true);

  SetRouter.set('/mail', mail.toMail, 'get', true);
  SetRouter.set('/mail', mail.doMail, 'post', true);

  SetRouter.set('/logout', login.logout, 'get', true);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};