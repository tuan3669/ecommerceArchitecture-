const JWT = require('jsonwebtoken');

const {
  AuthFailureError,
  NotFoundError,
} = require('../core/error.response');
const {
  findByUserId,
} = require('../services/keyToken.service');
const asyncHandler = require('../helpers/asyncHandler');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const createTokenPair = async (
  payload,
  publicKey,
  privateKey
) => {
  try {
    // accesstoken
    const accesstoken = await JWT.sign(
      payload,
      publicKey,
      {
        expiresIn: '2 days',
      }
    );
    const refreshToken = await JWT.sign(
      payload,
      privateKey,
      {
        expiresIn: '7 days',
      }
    );
    JWT.verify(
      accesstoken,
      publicKey,
      (err, decode) => {
        if (err) {
          console.log('err ', err);
        }

        console.log(
          `decode verify ::`,
          decode
        );
      }
    );

    return {
      accesstoken,
      refreshToken,
    };
  } catch (error) {
    console.log('errror ', error);
  }
};

const authentication = asyncHandler(
  async (req, res, next) => {
    const userId =
      req.headers[HEADER.CLIENT_ID];
    if (!userId)
      throw new AuthFailureError(
        'Invalid request'
      );
    // check thag xem Key này có phải của thằng userId xxx đó ko
    const keyStore = await findByUserId(
      { userId }
    );

    if (!keyStore)
      throw new NotFoundError(
        'Not found key store'
      );

    const accessToken =
      req.headers[HEADER.AUTHORIZATION];

    if (!accessToken)
      throw new AuthFailureError(
        'Invalid request'
      );

    try {
      const decodeUser = JWT.verify(
        accessToken,
        keyStore.publicKey
      );
      if (userId !== decodeUser.userId)
        throw new AuthFailureError(
          'Invalid userId'
        );

      req.keyStore = keyStore;
      return next();
    } catch (error) {
      throw error;
    }
  }
);

const verifyJWT = async (
  token,
  keySecret
) => {
  return await JWT.verify(
    token,
    keySecret
  );
};
module.exports = {
  createTokenPair,
  verifyJWT,
  authentication,
};
