var mongodb = require('./db.js');
var jsdom = require('jsdom');

var Post = function(post) {
  this.name = post.name;
  this.title = post.title;
  this.filter = post.filter;
  this.post = post.post;
  this.comments = []
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
    filter: this.filter,
    post: this.post,
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

Post.getOne = function(name, day, title, callback) {
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
      if(day) {
        query['time.day'] = day;
      }
      if(title) {
        query['title'] = title;
      }
      collection.findOne(query, function(err, post) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null, post);
      })
    })
  })
}

Post.getAllByPages = function(name, page, pageSize, filter, callback) {
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
      if(filter) {
        query.filter = filter;
      }
      collection.count(query, function(err, total) {
        if(err) {
          return callback(err);
        }
        collection.find(query, {
          skip: (page - 1) * pageSize,
          limit: pageSize
        }).sort({
          time: -1
        }).toArray(function(err, docs) {
          mongodb.close();
          if(err) {
            return callback(err);
          }
          callback(null, docs, total);
        });
      });
    });
  });
};

Post.formShortByDocs = function(docs, callback) {
  var _star = 0;
  var _len = docs.length;
  if(_len === 0) return callback(null, docs);
  docs.forEach(function(item) {
    jsdom.env(
      item['post'],
      ["../public/vendor/jquery/jquery-1.11.0.min.js"],
      function (errors, window) {
        if(errors) {
          return callback(errors);
        }
        item['img'] = window.$('img').attr('src');
        item['text'] = window.$(window.document).text();
        _star++;
        if(_star == _len) {
          callback(null, docs);
        }
      }
    );
  });
};

Post.edit = function(name, day, title, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({
        'name': name,
        'time.day': day,
        'title': title
      }, function(err, doc) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null, doc);
      })
    })
  })
};

Post.update = function(name, day, title, filter, post, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({
        'name': name,
        'time.day': day,
        'title': title
      }, {
        $set: {post: post, filter: filter}
      }, function(err, result) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null);
      })
    })
  })
};

Post.remove = function(name, day, title, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove({
        'name': name,
        'time.day': day,
        'title': title
      }, function(err, result) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};