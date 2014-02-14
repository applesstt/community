var auth = require('../controllers/auth.js'),
  home = require('../controllers/home.js'),
  login = require('../controllers/login.js'),
  regist = require('../controllers/regist.js'),
  article = require('../controllers/article.js'),
  mail = require('../controllers/mail.js'),
  user = require('../controllers/user.js');

var SetRouter = (function() {
  var _app;

  /**
   * @param url: url pattern
   * @param fun: callback
   * @param type: rest type
   * @param status: default - null, 1 - check login, 2 - check not login
   */
  var set = function(url, fun, type, status) {
    status = typeof status === 'undefined' ? 0 : status;
    var _hasLogin = status === 1 && true;
    var _hasNotLogin = status === 2 && true;
    type = typeof type === 'undefined' ? 'get' : type;
    if(_hasNotLogin) {
      _app[type](url, auth.checkNotLogin);
    } else if(_hasLogin) {
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
  //Set login and not login flag
  var _hasLogin = 1, _hasNotLogin = 2;

  //SetRouter init
  SetRouter.init(app);

  SetRouter.set('/demo1', home.toDemo1, 'get');

  SetRouter.set('/', home.toHome, 'get');

  SetRouter.set('/login', login.toLogin, 'get', _hasNotLogin);
  SetRouter.set('/login', login.doLogin, 'post', _hasNotLogin);

  SetRouter.set('/reg', regist.toReg, 'get', _hasNotLogin);
  SetRouter.set('/reg', regist.doReg, 'post', _hasNotLogin);

  SetRouter.set('/post', article.toPost, 'get', _hasLogin);
  SetRouter.set('/post', article.doPost, 'post', _hasLogin);
  SetRouter.set('/uploadImage', article.doUploadImage, 'post', _hasLogin);

  SetRouter.set('/u/:name', user.toUser, 'get');
  SetRouter.set('/u/:name/:day/:title', article.toView, 'get');
  SetRouter.set('/u/:name/:day/:title', article.doComment, 'post');

  SetRouter.set('/edit/:name/:day/:title', article.toUpdate, 'get', _hasLogin);
  SetRouter.set('/edit/:name/:day/:title', article.doUpdate, 'post', _hasLogin);

  SetRouter.set('/remove/:name/:day/:title', article.remove, 'get', _hasLogin);

  SetRouter.set('/mail', mail.toMail, 'get', _hasLogin);
  SetRouter.set('/mail', mail.doMail, 'post', _hasLogin);

  SetRouter.set('/logout', login.logout, 'get', _hasLogin);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};