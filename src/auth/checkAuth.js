const {
  findbyId,
} = require('../services/apiKey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const apiKey = async (
  req,
  res,
  next
) => {
  try {
    const key =
      req.headers[
        HEADER.API_KEY
      ]?.toString();
    if (!key)
      return res.status(403).json({
        message: 'Forbidden Error',
      });

    const objectKey = await findbyId(
      key
    );

    if (!objectKey)
      return res.status(403).json({
        message: 'Forbidden Error',
      });

    req.objectKey = objectKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions)
      return res.status(403).json({
        message: 'permission denied',
      });

    console.log(
      'permisson ',
      req.objectKey.permissions
    );

    const validPermisson =
      req.objectKey.permissions.includes(
        permission
      );

    if (!validPermisson)
      return res.status(403).json({
        message: 'permission denied',
      });

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
