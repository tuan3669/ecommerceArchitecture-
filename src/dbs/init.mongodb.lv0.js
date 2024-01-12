const mongoose = require('mongoose');

const connectString =
  'mongodb://127.0.0.1:27017/shopDEV';

mongoose
  .connect(connectString)
  .then((_) =>
    console.log(
      `Connected Mongodb success`
    )
  )
  .catch((err) =>
    console.log(`error connect ${err}`)
  );

if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', {
    color: true,
  });
}

module.exports = mongoose;
