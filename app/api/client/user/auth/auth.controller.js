import { info } from '../../../../services/logger';
import { CheckAuth } from '../../../middlewares/auth.mid';

const api = require('express').Router();
const {
  success,
  serverError,
} = require('../../../../utils/response-utils');
const User = require('../../../../models/user');
const { error } = require('../../../../services/logger');

api.post('/auth/credential', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      throw new Error('AUTH.ERROR.INVALID_REQUEST');
    } else {
      const user = await User.findOne({ username }).select(
        'username lastName firstName fullName publicKey encryptedPrivateKey ',
      );
      if (user) {
        return res.json(success(user));
      }
      throw new Error('AUTH.ERROR.USER_NOT_FOUND');
    }
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
api.post('/auth/ping', CheckAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.certificateInfo.username,
    }).populate(['role']);
    if (user) {
      return res.json(success(user));
    }
    throw new Error('AUTH.ERROR.USER_NOT_FOUND');
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
api.post('/auth/temp-password', CheckAuth, async (req, res) => {
  try {
    info(`${req.method} ${req.originalUrl}`, 123);
    const resData = req.body;
    const userInfo = await User.findOne({ username: req.userInfo.username });
    userInfo.tempPassword = JSON.stringify({ ...resData });
    await userInfo.save();
    return res.json(success(userInfo));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
api.post('/auth/password', CheckAuth, async (req, res) => {
  try {
    const resData = req.body;
    const userInfo = await User.findOne({ username: req.userInfo.username });
    userInfo.password = JSON.stringify({ ...resData });
    userInfo.publicKey = resData.publicKey;
    userInfo.encryptedPrivateKey = resData.encryptedPrivateKey;
    userInfo.tempPassword = null;
    await userInfo.save();
    return res.json(success(userInfo));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
module.exports = api;
