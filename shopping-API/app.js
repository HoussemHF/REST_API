var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRouter = require('./routes/products');
var app = express();
require('dotenv').config({path: './config/.env'});
require('./config/db');

app.use(cors());
app.use(logger('dev'));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});


module.exports = app;
