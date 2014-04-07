var Post = require('../models/post.js');

exports.toHome = function(req, res) {
  var pageSize = 10;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  Post.getAllByPages(null, page, pageSize, function(err, posts, count) {
    if(err) {
      posts = [];
    }
    Post.formShortByDocs(posts, function(err, docs) {
      res.render('index', {
        title: '败家党',
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error'),
        posts: docs,
        page: page,
        isFirst: page == 1,
        isLast:page * pageSize >= count
      });
    });
  });
};

exports.toDemo1 = function(req, res) {
  res.render('demo1');
};

exports.toDemo42009 = function(req, res) {
  res.render('demo42009');
};