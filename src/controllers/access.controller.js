const {
  CREATED,
  SuccessResponse,
} = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  handlerRefreshToken = async (
    req,
    res,
    next
  ) => {
    console.log(
      'refff ',
      req.body.refreshToken
    );
    new SuccessResponse({
      message:
        'Get resfreshToken success',
      metaData:
        await AccessService.handleRefreshToken(
          req.body.refreshToken
        ),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metaData:
        await AccessService.logout({
          keyStore: req.keyStore,
        }),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metaData:
        await AccessService.login(
          req.body
        ),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'resgister Ok',
      options: {
        limit: 10,
      },
      metaData:
        await AccessService.signUp(
          req.body
        ),
    }).send(res);
  };
}

module.exports = new AccessController();
