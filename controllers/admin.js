exports.toUsers = function(req, res) {
  res.render('admin/users', {
    title: '用户列表',
    user: req.session.user,
    env: req.session.env,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
}