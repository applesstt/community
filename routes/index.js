/**
 * set routers
 */

// get function
var index = function(req, res) {
  res.render('index', {title: '首页'});
};

var login = function(req, res) {
  res.render('login', {title: '登录'});
};

var reg = function(req, res) {
  res.render('reg', {title: '注册'});
};

var post = function(req, res) {
  res.render('post', {title: '发布'});
};

// post function

var doLogin = function(req, res) {

};

var doReg = function(req, res) {

};

var doPost = function(req, res) {

};

var doLogout = function(req, res) {

};

module.exports = function(app) {
  app.get('/', index);
  app.get('/login', login);
  app.get('/reg', reg);
  app.get('/post', post);

  app.post('/login', doLogin);
  app.post('/reg', doReg);
  app.post('/post', doPost);
  app.post('/logout', doLogout);
};