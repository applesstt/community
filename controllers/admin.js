var User = require('../models/user.js');

exports.toUsers = function(req, res) {
  var pageSize = 10;
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var userName = req.query.userName;
  User.getAllByPages(userName, page, pageSize, function(err, users, count) {
    if(err) {
      return console.log('User.getAllByPages error!');
    }
    res.render('admin/users', {
      title: '用户列表',
      user: req.session.user,
      env: req.session.env,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      users: users,
      userName: userName,
      page: page,
      isFirst: page == 1,
      isLast:page * pageSize >= count
    });
  });
};