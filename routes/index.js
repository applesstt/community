var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');

var auth = require('../controllers/auth.js'),
    home = require('../controllers/home.js'),
    login = require('../controllers/login.js'),
    regist = require('../controllers/regist.js'),
    article = require('../controllers/article.js');

/**
 * set routers
 */

var PageSize = 10;

var toUser = function(req, res) {
  var name = req.params.name;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  User.get(name, function(err, user) {
    if(!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/');
    }
    Post.getAllByPages(User.name, page, PageSize, function(err, posts, count) {
      if(err) {
        req.flash('error', err);
        res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        page: page,
        isFirst: page == 1,
        isLast: page * PageSize >= count
      });
    });
  });
};

module.exports = function(app) {
  app.get('/', home.toHome);

  app.get('/login', auth.checkNotLogin);
  app.get('/login', login.toLogin);
  app.get('/login', auth.checkNotLogin);
  app.post('/login', login.doLogin);


  app.get('/reg', auth.checkNotLogin);
  app.get('/reg', regist.toReg);
  app.get('/reg', auth.checkNotLogin);
  app.post('/reg', regist.doReg);

  app.get('/post', auth.checkLogin);
  app.get('/post', article.toPost);
  app.get('/post', auth.checkLogin);
  app.post('/post', article.doPost);

  app.get('/u/:name', toUser);

  app.get('/u/:name/:day/:title', article.toView);
  app.post('/u/:name/:day/:title', article.doComment);

  app.get('/edit/:name/:day/:title', auth.checkLogin);
  app.get('/edit/:name/:day/:title', article.toUpdate);

  app.post('/edit/:name/:day/:title', auth.checkLogin);
  app.post('/edit/:name/:day/:title', article.doUpdate);

  app.get('/remove/:name/:day/:title', auth.checkLogin);
  app.get('/remove/:name/:day/:title', article.remove);

  app.get('/logout', login.logout);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};