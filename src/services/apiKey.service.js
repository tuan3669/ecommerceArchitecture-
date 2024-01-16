const apikeyModel = require('../models/apikey.model');

const crypto = require('node:crypto');

const findbyId = async (key) => {
  const newKey =
    await apikeyModel.create({
      key: crypto
        .randomBytes(64)
        .toString('hex'),
      permissions: ['0000'],
    });
  console.log(newKey);
  const objectKey = await apikeyModel
    .findOne({
      key,
      status: true,
    })
    .lean();

  return objectKey;
};

module.exports = {
  findbyId,
};
