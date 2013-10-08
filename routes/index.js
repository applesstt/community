var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');

var auth = require('../controllers/auth.js'),
    home = require('../controllers/home.js'),
    login = require('../controllers/login.js'),
    regist = require('../controllers/regist.js');

/**
 * set routers
 */

var PageSize = 10;

var toPost = function(req, res) {
  res.render('post', {
    title: '发布',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

var doPost = function(req, res) {
  var user = req.session.user;
  var image_name = req.files.image.name;
  if(image_name !== '') {
    var target_path = './public/upload/images' + image_name;
    fs.renameSync(req.files.image.path, target_path);
  }
  var post = new Post({
    name: user.name,
    title: req.body.title,
    post: req.body.post,
    image: image_name
  });
  post.save(function(err) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    res.redirect('/');
  });
};

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

var toPostInfo = function(req, res) {
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  Post.getOne(name, day, title, function(err, post) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    console.log(post);
    res.render('article', {
      title: post.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

var toEdit = function(req, res) {
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  var currentUser = req.session.user;
  Post.edit(currentUser.name, day, title, function(err, post) {
    if(err) {
      req.flash('error', err);
      res.redirect('');
    }
    res.render('edit', {
      title: '编辑',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
};

var update = function(req, res) {
  var currentUser = req.session.user;
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  Post.update(currentUser.name, day, title, req.body.post, function(err) {
    var url = '/u/' + name + '/' + day + '/' + title;
    if(err) {
      req.flash('error', err);
      return res.redirect(url);
    }
    req.flash('success', '修改成功!');
    res.redirect(url);
  })
};

var remove = function(req, res) {
  var currentUser = req.session.user;
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  Post.remove(currentUser.name, day, title, function(err) {
    if(err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    req.flash('success', '删除成功!');
    res.redirect('/');
  })
}


var postComment = function(req, res) {
  var date = new Date();
  var time = date.getFullYear() + "-" +
    (date.getMonth()+1) + "-" +
    date.getDate() + " " +
    date.getHours() + ":" +
    date.getMinutes();
  var name = req.body.name;
  var email = req.body.email;
  var website = req.body.website;
  var content = req.body.content;
  var comment = {
    name: name,
    email: email,
    website: website,
    time: time,
    content: content
  }
  var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
  newComment.save(function(err) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '留言成功!');
    res.redirect('back');
  })
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
  app.get('/post', toPost);
  app.get('/post', auth.checkLogin);
  app.post('/post', doPost);

  app.get('/u/:name', toUser);

  app.get('/u/:name/:day/:title', toPostInfo);
  app.post('/u/:name/:day/:title', postComment);

  app.get('/edit/:name/:day/:title', auth.checkLogin);
  app.get('/edit/:name/:day/:title', toEdit);

  app.post('/edit/:name/:day/:title', auth.checkLogin);
  app.post('/edit/:name/:day/:title', update);

  app.get('/remove/:name/:day/:title', auth.checkLogin);
  app.get('/remove/:name/:day/:title', remove);

  app.get('/logout', login.logout);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};