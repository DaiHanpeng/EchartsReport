var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var data = require('./routes/data');

var tatcount = require('./routes/tatcount');
var barchart = require('./routes/barchart');

var tatanalyzer = require('./routes/tatanalyzer');
var boxplotanalyzer = require('./routes/boxplotanalyzer');

var tattime = require('./routes/tattime');
var boxplottime = require('./routes/boxplottime');

var tatmultiplot = require('./routes/tatmultiplot')
var multiplot = require('./routes/multiplot')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/', barchart);
app.use('/users', users);

app.use('/tatanalyzer', tatanalyzer);
app.use('/boxplotanalyzer', boxplotanalyzer);

app.use('/tattime', tattime);
app.use('/boxplottime', boxplottime);

app.use('/tatcount', tatcount);
app.use('/barchart', barchart);

app.use('/tatmultiplot', tatmultiplot);
app.use('/multiplot', multiplot);


//for static file, we don't need to specify route here, though we can do that this way...
//app.use('/data.json', data);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
