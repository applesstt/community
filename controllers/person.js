exports.toSet = function(req, res) {
  res.render('person/set', {
    title: '基本信息',
    user: req.session.user,
    env: req.session.env,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
}