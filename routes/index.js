var auth = require('../controllers/auth.js'),
  home = require('../controllers/home.js'),
  login = require('../controllers/login.js'),
  regist = require('../controllers/regist.js'),
  article = require('../controllers/article.js'),
  mail = require('../controllers/mail.js'),
  user = require('../controllers/user.js'),
  person = require('../controllers/person.js'),
  admin = require('../controllers/admin.js');

module.exports = function(app) {

  app.get('/demo1', home.toDemo1);

  app.get('*', function(req, res, next) {
    req.session.env = app.get('env');
    next();
  });

  app.get('/', home.toHome);

  app.get('/star', home.toStar);

  app.all('/login*', auth.checkNotLogin);
  app.get('/login', login.toLogin);
  app.post('/login', login.doLogin);

  app.all('/reg*', auth.checkNotLogin);
  app.get('/reg', regist.toReg);
  app.post('/reg', regist.doReg);

  app.all('/post', auth.checkLogin);
  app.get('/post', article.toPost);
  app.post('/post', article.doPost);

  app.post('/uploadImage', auth.checkLogin);
  app.post('/uploadImage', article.doUploadImage);

  app.post('/cropImage', auth.checkLogin);
  app.post('/cropImage', article.doCropImage);

  app.get('/u/:name', user.toUser);
  app.get('/u/:name/:day/:title', article.toView);
  app.post('/u/:name/:day/:title', article.doComment);

  app.get('/avatar/:name', user.getAvatar);

  app.all('/edit/:name/:day/:title', auth.checkLogin);
  app.get('/edit/:name/:day/:title', article.toUpdate);
  app.post('/edit/:name/:day/:title', article.doUpdate);

  app.get('/remove/:name/:day/:title', auth.checkLogin);
  app.get('/remove/:name/:day/:title', article.remove);

  app.all('/mail*', auth.checkLogin);
  app.get('/mail', mail.toMail);
  app.post('/mail', mail.doMail);

  app.all('/person*', auth.checkLogin);
  app.get('/person', person.toSet);
  app.post('/person', person.doSet);

  app.all('/admin*', auth.checkLogin);
  app.all('/admin*', auth.checkSupperAdmin);
  app.all('/admin', admin.toUsers);

  app.all('/logout', auth.checkLogin);
  app.get('/logout', login.logout);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};