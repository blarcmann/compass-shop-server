var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
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



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));


var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
app.use('/products', productRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


const port = process.env.PORT || 3000;
app.listen(port, function (err) {
  console.log(`Shit happens on port ${port}`);
});