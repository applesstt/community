var mongodb = require('./db');

// 重置新的user属性
var resetUser = function(user) {
  user.city = user.city || '';
  user.website = user.website || '';
  user.des = user.des || '';
  return user;
};

var User = function(user) {
  user = resetUser(user);
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
  this.city = user.city;
  this.website = user.website;
  this.des = user.des;
};

module.exports = User;

User.prototype.save = function(callback) {
  var user = this;

  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }

    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.insert(user, {safe: true}, function(err, user) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null);
      })
    });

  })
};

User.prototype.update = function(callback) {
  var user = this;

  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }

    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      collection.update({name: user.name}, {$set: user}, {}, function(err) {
        mongodb.close();
        if(err) {
          return callback(err);
        }
        callback(null);
      })
    })
  })
};

User.get = function(name, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if(err) {
        callback(err);
      }
      collection.findOne({
        name: name
      }, function(err, user) {
        mongodb.close();
        if(user) {
          return callback(null, resetUser(user));
        }
        return callback(err);
      })
    })
  })
};

// 用户列表
User.getAllByPages = function(userName, page, pageSize, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if(userName) {
        query.name = userName;
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