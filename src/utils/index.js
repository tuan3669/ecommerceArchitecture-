const _ = require('lodash');

const getInfoData = ({
  fileds = [],
  object = {},
}) => _.pick(object, fileds);

module.exports = getInfoData;
