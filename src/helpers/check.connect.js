const {
  default: mongoose,
} = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
const countConnect = () => {
  const numberConecttion =
    mongoose.connections.length;
  console.log(
    `Number connecttion ${numberConecttion}`
  );
};

const checkOverload = () => {
  setInterval(() => {
    const numberConecttion =
      mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage =
      process.memoryUsage().rss;
    //   maximum connection based on number
    console.log(
      'numberConecttion ',
      numberConecttion
    );
    console.log('numCores ', numCores);
    console.log(
      'memoryUsage ',
      memoryUsage / 1024 / 1024
    );
    const maxConnections = numCores * 5;
    if (
      numberConecttion > maxConnections
    ) {
      console.log('connect overload ');
    }
  }, _SECONDS);
};
module.exports = {
  countConnect,
  checkOverload,
};
