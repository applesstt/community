var nodemailer = require('nodemailer');

exports.toMail = function(req, res) {
  res.render('mail', {
    title: '发送邮件',
    user: req.session.user,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

exports.doMail = function(req, res) {
  var title = req.body.title;
  var toMail = req.body.toMail;
  var text = req.body.text;
  if(toMail === '') {
    req.flash('error', '请输入发送的邮件地址！');
    return res.redirect('/mail');
  }
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: 'applesstt@gmail.com',
      pass: 'applesstt924821'
    }
  });

  var mailOptions = {
    from: 'Applesstt Gmail <applesstt@gmail.com>',
    to: toMail,
    subject: title,
    text: text
  };

  smtpTransport.sendMail(mailOptions, function(err, response) {
    if(err) {
      req.flash('error', err);
    } else {
      req.flash('success', '邮件发送成功!');
    }
    res.redirect('/mail');
  });
};