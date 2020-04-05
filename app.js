var createError = require('http-errors');
var express = require('express');
// var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('dotenv').config();
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to a shitty db');
  }
});
mongoose.set('useCreateIndex', true);



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// var usersRouter = require('./routes/users');
// var indexRouter = require('./routes/index');
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(res);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
