var Post = require('../models/post.js');

exports.toHome = function(req, res) {
  var pageSize = 10;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var filter = req.query.filter;
  Post.getAllByPages(null, page, pageSize, filter, function(err, posts, count) {
    if(err) {
      posts = [];
    }
    Post.formShortByDocs(posts, function(err, docs) {
      if(err) {
        return console.log('Post.formShortByDocs error!');
      }
      res.render('index', {
        title: '败家党',
        user: req.session.user,
        env: req.session.env,
        success: req.flash('success'),
        error: req.flash('error'),
        posts: docs,
        filter: filter,
        page: page,
        isFirst: page == 1,
        isLast:page * pageSize >= count
      });
    });
  });
};

exports.toStar = function(req, res) {
  res.render('star', {
    title: '败家之星',
    user: req.session.user,
    env: req.session.env,
    success: req.flash('success'),
    error: req.flash('error'),
    filter: 'star'
  });
};

exports.toDemo1 = function(req, res) {
  res.render('demo1');
};

exports.toDemo42009 = function(req, res) {
  res.render('demo42009');
};