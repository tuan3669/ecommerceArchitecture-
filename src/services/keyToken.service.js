const { Types } = require('mongoose');
const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static findByRefreshTokenUsed =
    async (refreshToken) => {
      return await keytokenModel
        .findOne({
          refreshTokensUsed:
            refreshToken,
        })
        .lean();
    };
  static findByRefreshToken = async (
    refreshToken
  ) => {
    return await keytokenModel.findOne({
      refreshToken,
    });
  };

  static findByUserId = async ({
    userId,
  }) => {
    return await keytokenModel
      .findOne({
        user: userId,
      })
      .lean();
  };

  static removeKeyById = async (
    keyStore
  ) => {
    return await keytokenModel.deleteOne(
      keyStore._id
    );
  };
  static deleteKeyById = async ({
    userId,
  }) => {
    return await keytokenModel.deleteOne(
      {
        user: userId,
      }
    );
  };

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens =
      //   await keytokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey,
      //   });
      // return tokens
      //   ? tokens.publicKey
      //   : null;

      // level x
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };
      const tokens =
        await keytokenModel.findOneAndUpdate(
          filter,
          update,
          options
        );

      return tokens
        ? tokens.publicKey
        : null;
    } catch (error) {
      console.log(
        'errrrrr :::: ',
        error
      );
      throw new Error(error);
    }
  };
}

module.exports = KeyTokenService;
