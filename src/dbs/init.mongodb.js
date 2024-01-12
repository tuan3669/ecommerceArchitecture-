const mongoose = require('mongoose');
const {
  countConnect,
} = require('../helpers/check.connect');
const {
  db: { host, name, port },
} = require('../configs/config.mongo');

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(
  'connectString ::',
  connectString
);
class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', {
        color: true,
      });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log(
          `Connected Mongodb success pro::`,
          countConnect()
        );
      })
      .catch((err) =>
        console.log(
          `error connect ${err}`
        )
      );
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance =
        new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb =
  Database.getInstance();

module.exports = instanceMongodb;
