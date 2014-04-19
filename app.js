
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var fs = require('fs');
var pjax = require('express-pjax');
var http = require('http');
var path = require('path');

/**
 * sudo mongod --fork
 * sudo mongo
 */
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(pjax());
app.use(express.favicon('./public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser({
  keepExtensions: true,
  uploadDir: './public/upload/images'
}));
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
  store: new MongoStore({
    db: settings.db
  })
}));

app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
