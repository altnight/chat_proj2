
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  //適当すぎるけどいいのかな？
  app.use(express.session({
    secret: "secret",
    store: new MongoStore({ db: 'chat' })
  }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', routes.create_signup);
app.get('/login', routes.login);
app.post('/login', routes.create_login);
app.get('/logout', routes.logout);
app.get('/roby', routes.roby);
app.post('/roby', routes.create_roby);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
