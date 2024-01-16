const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const {
  createTokenPair,
  verifyJWT,
} = require('../auth/authUtils');
const getInfoData = require('../utils');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../core/error.response');
const {
  findByEmail,
} = require('./shop.service');

const roleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
};

class AccessService {
  static handleRefreshToken = async (
    refreshToken
  ) => {
    // check token used
    const foundToken =
      await KeyTokenService.findByRefreshTokenUsed(
        refreshToken
      );
    // nếu token đã dc sử dụng rồi mà cần làm mới thì ta đưa vào việc nghi vấn
    console.log(
      'ffff ///',
      refreshToken
    );
    if (foundToken) {
      const { userId, email } =
        await verifyJWT(
          refreshToken,
          foundToken.privateKey
        );
      console.log('userId ', {
        userId,
        email,
      });
      // xoá tất cả token trong KeySrore
      await KeyTokenService.deleteKeyById(
        userId
      );
      throw new ForbiddenError(
        'Something wrng happen !! plase relogin'
      );
    }

    // chua có
    const holderToken =
      await KeyTokenService.findByRefreshToken(
        refreshToken
      );
       
    if (!holderToken)
      throw new AuthFailureError(
        'shop not register'
      );
    const { userId, email } =
      await verifyJWT(
        refreshToken,
        holderToken.privateKey
      );

    const foundShop = await findByEmail(
      { email }
    );

    if (!foundShop)
      throw new AuthFailureError(
        'shop not register 2'
      );

    // tạo 1 căp token mói
    // tao  access vs refrestoken bằng jwt
    const tokens =
      await createTokenPair(
        {
          userId: foundShop._id,
          email,
        },
        holderToken.publicKey,
        holderToken.privateKey
      );

    // lưu refreshToken vào db

    await holderToken.updateOne({
      $set: {
        refreshToken:
          tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // refreshToken đã dc sử dụng đẻ lấy token mới rồi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async ({
    keyStore,
  }) => {
    return await KeyTokenService.removeKeyById(
      keyStore
    );
  };

  static login = async ({
    email,
    password,
    refreshToken = null,
  }) => {
    const foundShop = await findByEmail(
      { email }
    );
    if (!foundShop)
      throw new BadRequestError(
        'Shop not registered'
      );

    const match = bcrypt.compare(
      password,
      foundShop.password
    );

    if (!match)
      throw new AuthFailureError(
        'Authentication error'
      );

    const privateKey = crypto
      .randomBytes(64)
      .toString('hex');
    const publicKey = crypto
      .randomBytes(64)
      .toString('hex');

    // tao  access vs refrestoken bằng jwt
    const tokens =
      await createTokenPair(
        {
          userId: foundShop._id,
          email,
        },
        publicKey,
        privateKey
      );

    // lưu refreshToken vào db
    await KeyTokenService.createKeyToken(
      {
        userId: foundShop._id,
        refreshToken:
          tokens.refreshToken,
        privateKey,
        publicKey,
      }
    );

    // trả cho user acceesstoken và resfrshtoken
    return {
      shop: getInfoData({
        fileds: [
          '_id',
          'name',
          'email',
        ],
        object: foundShop,
      }),
      tokens: tokens,
    };
  };

  static signUp = async ({
    name,
    email,
    password,
  }) => {
    // step 1 : check email

    const holderShop = await shopModel
      .findOne({ email })
      .lean();
    if (holderShop)
      throw new BadRequestError(
        'Shop already register !'
      );
    // return {
    //   code: 'xx',
    //   message:
    //     'Shop already register !',
    // };

    const passwordHash =
      await bcrypt.hash(password, 10);
    const newShop =
      await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [roleShop.SHOP],
      });

    if (newShop) {
      // ver 1 hơi khó hệ thống lớn 1 dùng
      // create private key, publickey
      // private key đưa cho người dùng sign token
      // publickey thì chúng ta sẽ lưu và verify token
      // ví dụ hacker nó vào hệ thống nó lấy dc cái publickey của chúng ta
      //   thuat toan bat doi xứng
      // const {
      //   privateKey,
      //   publicKey,
      // } = crypto.generateKeyPairSync(
      //   'rsa',
      //   {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //       type: 'pkcs1',
      //       format: 'pem',
      //     },
      //     privateKeyEncoding: {
      //       type: 'pkcs1',
      //       format: 'pem',
      //     },
      //   }
      // );

      // ver 2 dễ hơn
      const privateKey = crypto
        .randomBytes(64)
        .toString('hex');
      const publicKey = crypto
        .randomBytes(64)
        .toString('hex');

      const keyStore =
        await KeyTokenService.createKeyToken(
          {
            userId: newShop._id,
            publicKey,
            privateKey,
          }
        );

      if (!keyStore)
        return {
          code: 'xxx',
          message: 'keyStore error',
        };

      // tạo 1 cặp token
      const tokens =
        await createTokenPair(
          {
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: [
              '_id',
              'name',
              'email',
            ],
            object: newShop,
          }),
          tokens: tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
    // return {
    //   code: 'xxxx',
    //   message: error.message,
    //   status: 'error',
    // };
  };
}

module.exports = AccessService;
