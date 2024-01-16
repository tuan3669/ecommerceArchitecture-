const express = require('express');
const app = express();
const morgan = require('morgan');
const compression = require('compression');
const {
  default: helmet,
} = require('helmet');

require('dotenv').config();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// giảm nhẹ size giữa sever vs client
app.use(compression());
// init db
require('./dbs/init.mongodb');
// checkOverload()
// init router
app.use('/', require('./routes'));

// handel error

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode =
    error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message:
      error.message ||
      'Internal Server Error',
  });
});
module.exports = app;
