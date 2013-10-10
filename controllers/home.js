var Post = require('../models/post.js');

exports.toHome = function(req, res) {
  var pageSize = 10;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  Post.getAllByPages(null, page, pageSize, function(err, posts, count) {
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
      isLast:page * pageSize >= count
    });
  });
};