var mongodb = require('./db.js');

var Post = function(post) {
  this.name = post.name;
  this.title = post.title;
  this.post = post.post;
  this.image = post.image;
};

module.exports = Post;

Post.prototype.save = function(callback) {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDay() + 1;
  var minute = date.getMinutes();
  var time = {
    date: date,
    year: year,
    month: year + '-' + month,
    day: year + '-' + month + '-' + day,
    minute: year + '-' + month + '-' + day + ':' + minute
  };
  var post = {
    name: this.name,
    title: this.title,
    post: this.post,
    image: this.image,
    time: time
  };
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.insert(post, {safe: true}, function(err, post) {
        mongodb.close();
        return callback(null);
      })
    })
  })
};

Post.get = function(name, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if(name) {
        query.name = name;
      }
      collection.find(query).sort({
        time: -1
      }).toArray(function(err, docs) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null, docs);
      })
    })
  })
};