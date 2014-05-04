var User = require('../models/user.js'),
    fs = require('fs'),
    send = require('send'),
    Post = require('../models/post.js');

exports.toUser = function(req, res) {
  var name = req.params.name;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var pageSize = 10;
  User.get(name, function(err, user) {
    if(!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/');
    }
    Post.getAllByPages(user.name, page, pageSize, null, function(err, posts, count) {
      if(err) {
        req.flash('error', err);
        res.redirect('/');
      }
      Post.formShortByDocs(posts, function(err, docs) {
        res.render('user', {
          title: user.name,
          author: user,
          posts: posts,
          user: req.session.user,
          env: req.session.env,
          success: req.flash('success').toString(),
          error: req.flash('error').toString(),
          page: page,
          isFirst: page == 1,
          isLast: page * pageSize >= count
        });
      });
    });
  });
};

var _defaultAvatar = './public/img/wx_logo.png';

exports.getAvatar = function(req, res) {
  send(req, './public/avatar/' + req.params.name + '.png')
    .on('error', function() {
      send(req, _defaultAvatar).pipe(res);
    })
    .pipe(res);
};