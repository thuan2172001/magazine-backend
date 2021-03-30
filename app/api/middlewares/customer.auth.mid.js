import { CHECK_AUTH, API_PREFIX, CHECK_CHANGE_PASSWORD } from '../../environment';

const { unauthorized } = require('../../utils/response-utils');
const { VerifyMessage } = require('../../utils/crypto-utils');
const Customer = require('../../models/customer');

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    Customer.findOne(
      { username },
      (err, userInDB) => {
        if (err) reject(err);
        resolve(userInDB);
      },
    );
  });
}
const ByPassAuth = (req, res, next) => {
  if (!CHECK_AUTH || CHECK_AUTH === 'false') {
    const username = req.query.fakeUsername ? req.query.fakeUsername : 'admin';
    findUserByUsername(username).then((customerInfo) => {
      req.customerInfo = customerInfo;
      next();
    });
    return true;
  }
  return false;
};

export const CheckCustomerAuth = (req, res, next) => {
  try {
    const authString = req.headers.authorization;
    if (!authString || authString === '') {
      if (ByPassAuth(req, res, next)) return;
      res.json(unauthorized('AUTH.ERROR.NOT_LOGGED_IN'));
      return;
    }
    const authInfo = JSON.parse(authString);
    const unexpired = () => {
      const expiredTime = new Date(authInfo.certificateInfo.timestamp);
      expiredTime.setSeconds(
        expiredTime.getSeconds() + authInfo.certificateInfo.exp,
      );
      return new Date() < expiredTime;
    };
    if (!unexpired()) {
      if (ByPassAuth(req, res, next)) return;
      res.json(unauthorized('AUTH.ERROR.EXPIRED'));
      return;
    }
    const isValid = VerifyMessage(
      authInfo.signature,
      authInfo.certificateInfo,
      authInfo.publicKey,
    );
    if (!isValid) {
      if (ByPassAuth(req, res, next)) return;
      res.json(unauthorized('AUTH.ERROR.INVALID'));
      return;
    }
    findUserByUsername(authInfo.certificateInfo.username).then((customerInfo) => {
      if (!customerInfo) {
        if (ByPassAuth(req, res, next)) return;

        return res.json(unauthorized('AUTH.ERROR.USERNAME_NOTFOUND'));
      }
      if (customerInfo.isLocked) {
        if (ByPassAuth(req, res, next)) return;

        return res.json(unauthorized('AUTH.ERROR.LOCKED'));
      }
      if (customerInfo.publicKey !== authInfo.publicKey) {
        if (ByPassAuth(req, res, next)) return;

        return res.json(unauthorized('AUTH.ERROR.MISMATCH_PUBLIC_KEY'));
      }
      const isSetTempPassword = req.originalUrl === `${API_PREFIX}/auth/customer/temp-password`;
      const isChangePassword = req.originalUrl === `${API_PREFIX}/auth/customer/password`;
      if (CHECK_CHANGE_PASSWORD === true
                && customerInfo.publicKey === customerInfo.issuedPublicKey
                && !isSetTempPassword
                && !isChangePassword
      ) {
        if (ByPassAuth(req, res, next)) return;
        return res.json(unauthorized('AUTH.ERROR.NEED_TO_CHANGE_PASSWORD'));
      }
      // if (req.method !== 'GET') {
      //   const { _signature, _actionType } = req.body;
      //
      //   const realMethod = req.method.toLowerCase();
      //
      //   if (typeof _actionType !== 'string' || _actionType.length === 0) {
      //     return res.json(badRequest('AUTH.ERROR.ACTION_TYPE_INVALID'));
      //   }
      //   if (_actionType !== realMethod) {
      //     return res.json(badRequest('AUTH.ERROR.ACTION_TYPE_MISMATCH'));
      //   }
      //   if (!_signature) {
      //     return res.json(unauthorized('AUTH.ERROR.SIGNATURE_BODY_MISSING'));
      //   }
      //   const temp = { ...req.body, _signature: undefined };
      //   const tt = VerifyMessage(_signature, temp, userInfo.publicKey);
      //   if (
      //     !VerifyMessage(
      //       _signature,
      //       {
      //         ...req.body,
      //         _signature: undefined,
      //       },
      //       authInfo.publicKey,
      //     )
      //   ) return res.json(unauthorized('AUTH.ERROR.SIGNATURE_BODY_MISMATCH'));
      // }
      req.customerInfo = customerInfo;
      return next();
    });
  } catch (e) {
    console.log(e.message);
    res.json(unauthorized('AUTH.ERROR.INTERNAL_ERROR'));
  }
};
