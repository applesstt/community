var Post = require('../models/post.js'),
    fs = require('fs'),
    im = require('imagemagick'),
    async = require('async'),
    Comment = require('../models/comment.js'),
    User = require('../models/user.js');

exports.toPost = function(req, res) {
  res.render('post', {
    title: '发布',
    post: {
      title: '',
      post: '',
      day: ''
    },
    author: req.session.user,
    user: req.session.user,
    env: req.session.env,
    isNew: true,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

exports.doPost = function(req, res) {
  var user = req.session.user;
  var post = new Post({
    name: user.name,
    title: req.body.title,
    filter: req.body.filter,
    post: req.body.post
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

exports.toView = function(req, res) {
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  Post.getOne(name, day, title, function(err, post) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    User.get(name, function(err, user) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.renderPjax('article', {
        title: post.title,
        author: user,
        post: post,
        user: req.session.user,
        env: req.session.env,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
};

exports.toUpdate = function(req, res) {
  var day = req.params.day;
  var title = req.params.title;
  var currentUser = req.session.user;
  Post.edit(currentUser.name, day, title, function(err, post) {
    if(err) {
      req.flash('error', err);
      res.redirect('');
    }
    User.get(req.session.user.name, function(err, user) {
      if(err) {
        req.flash('error', err);
        res.redirect('');
      }
      res.render('post', {
        title: '编辑',
        author: user,
        post: post,
        user: req.session.user,
        env: req.session.env,
        isNew: false,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    })
  });
};

exports.doUpdate = function(req, res) {
  var currentUser = req.session.user;
  var name = req.params.name;
  var day = req.params.day;
  var title = req.params.title;
  var filter = req.body.filter;
  Post.update(currentUser.name, day, title, filter, req.body.post, function(err) {
    var url = '/u/' + name + '/' + day + '/' + encodeURIComponent(title);
    if(err) {
      req.flash('error', err);
      return res.redirect(url);
    }
    req.flash('success', '修改成功!');
    res.redirect(url);
  })
};

exports.remove = function(req, res) {
  var currentUser = req.session.user;
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
};

exports.doComment = function(req, res) {
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

var resizeImage = function(srcPath, dstPath, width, callback) {
  var imParams = {
    srcPath: srcPath,
    dstPath: dstPath,
    width: width
  };

  im.resize(imParams, function(err, stdout, stderr) {
    if(err) {
      callback(err);
    } else {
      console.log('Resize ' + dstPath + ' to ' + width + 'px width image!');
      callback(null, width);
    }
  });
}

exports.doUploadImage = function(req, res) {
  var image_name = req.files['upload-image'].name;
  if(image_name !== '') {
    image_name = (new Date()).getTime() + '_' + image_name;
    var base_path = '/upload/images/';
    var target_path = './public/upload/images/' + image_name;
    var target_path_200 = './public/upload/images/' + '200_' + image_name;
    var target_path_580 = './public/upload/images/' + '580_' + image_name;
    fs.renameSync(req.files['upload-image'].path, target_path);
    async.parallel([function(callback) {
      resizeImage(target_path, target_path_200, 200, callback);
    }, function(callback) {
      resizeImage(target_path, target_path_580, 580, callback);
    }], function(err, results) {
      if(err) return console.log(err);
      res.send({
        base_path: base_path,
        image: image_name
      });
    });
  }
};

exports.doCropImage = function(req, res) {
  var userName = req.session.user.name;
  var avatarPath = '/avatar/';
  var srcImgPath = req.body.srcImgPath;
  var srcImgName = req.body.srcImgName;
  var coords = req.body.coords;
  var root = './public';
  var imgName = userName + '.png';
  //convert rose: -crop 40x30+40+30  crop_br.gif
  var args = [root + srcImgPath + srcImgName, '-crop', coords,
    root + avatarPath + imgName];
  im.convert(args, function(err) {
    if(err) return console.log(err);
    console.log('Crop account img path: ' + root + avatarPath + userName);
    res.send({
      base_path: avatarPath,
      image_name: userName
    });
  });
}