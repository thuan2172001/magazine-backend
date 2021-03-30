import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import {
  getAll,
  read,
} from './notification.service';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';

const api = express.Router();

api.get('/notification', CheckAuth, async (req, res) => {
  try {
    const { _id } = req.userInfo;

    const args = req.query;

    const results = await getAll(args, _id);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/notification/:notificationId', CheckAuth, async (req, res) => {
  try {
    const { _id } = req.userInfo;

    const args = req.params;

    const results = await read(args, _id);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
