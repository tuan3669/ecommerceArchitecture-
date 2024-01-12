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
// giảm nhẹ size giữa sever vs client
app.use(compression());
// init db
require('./dbs/init.mongodb');
// checkOverload()
// init router
app.get('/', (req, res, next) => {
  const str = 'helloo Tuan';

  return res.status(200).json({
    message: 'Wellcome tuan',
    metadata: str.repeat(100000),
  });
});
// handel error
module.exports = app;
