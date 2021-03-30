import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import {
  sendEmail,
} from './mail.service';
import { success } from '../../../utils/response-utils';
import CommonError from '../../library/error';

const api = express.Router();

api.post('/mail', async (req, res) => {
  try {
    // const { _id } = req.userInfo;
    const args = req.params;
    console.log(args);
    const results = await sendEmail('thuan2172001@gmail.com', 'Trinh Van Thuan', 'alertDays');
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
