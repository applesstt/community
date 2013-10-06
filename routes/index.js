var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

var checkLogin = function(req, res, next) {
  if(!req.session.user) {
    req.flash('error', '请登录!');
    res.redirect('/login');
  }
  next();
};

var checkNotLogin = function(req, res, next) {
  if(req.session.user) {
    req.flash('error', '已登录!');
    res.redirect('back');
  }
  next();
};

/**
 * set routers
 */

var PageSize = 10;

// get function
var index = function(req, res) {
  var page = req.query.page ? parseInt(req.query.page) : 1;
  Post.getAllByPages(null, page, PageSize, function(err, posts, count) {
    if(err) {
      posts = [];
    }
    res.render('index', {
      title: '首页',
      user: req.session.user,
      success: req.flash('success'),
      error: req.flash('error'),
      posts: posts,
      page: page,
      isFirst: page == 1,
      isLast:page * PageSize >= count
    });
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


var logout = function(req, res) {
  req.session.user = null;
  req.flash('success', '成功退出!');
  res.redirect('/');
};

var post = function(req, res) {
  res.render('post', {
    title: '发布',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
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

module.exports = function(app) {
  app.get('/', index);

  app.get('/login', checkNotLogin);
  app.get('/login', login);
  app.get('/login', checkNotLogin);
  app.post('/login', doLogin);


  app.get('/reg', checkNotLogin);
  app.get('/reg', reg);
  app.get('/reg', checkNotLogin);
  app.post('/reg', doReg);

  app.get('/post', checkLogin);
  app.get('/post', post);
  app.get('/post', checkLogin);
  app.post('/post', doPost);

  app.get('/u/:name', toUser);

  app.get('/u/:name/:day/:title', toPostInfo);

  app.get('/edit/:name/:day/:title', checkLogin);
  app.get('/edit/:name/:day/:title', toEdit);

  app.post('/edit/:name/:day/:title', checkLogin);
  app.post('/edit/:name/:day/:title', update);

  app.get('/remove/:name/:day/:title', checkLogin);
  app.get('/remove/:name/:day/:title', remove);

  app.get('/logout', logout);

  app.use(function(req, res) {
    res.render('404', {
      title: '404'
    });
  })
};