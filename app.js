/// <reference path="./typings/index.d.ts" />

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authentication = require('express-authentication');

var routes = require('./routes/index');
var users = require('./routes/users');
var mt4 = require('./routes/mt4');
var chat = require('./routes/chat');
var ava = require('./routes/avatest');
var fbs = require('./routes/fbs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function myAuth(req, res, next) {
  req.challenge = req.get('Authorization');
  req.authenticated = req.authentication === 'secret';

  if (req.authenticated) {
    req.authentication = {
      user: 'bob'
    };
  } else {
    req.authentication = {
      error: 'INVALID_API_KEY'
    };
  }

  next();
});

app.use('/', routes);
app.use('/users', users);

app.use('/mt4', mt4);
app.use('/chat', chat);

app.use('/ava', ava);
app.use('/fbs', fbs);

app.get('/secret', authentication.required(), function (req, res) {
  res.status(200).send('Hello!');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;