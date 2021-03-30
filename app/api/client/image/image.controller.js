import express from 'express';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';

const path = require('path');

const api = express.Router();

api.get('/image', async (req, res) => {
  try {
    const args = req.query;
    const { url } = args;
    if (!url) {
      throw new Error('VALIDATE.ERROR.URL_NOT_FOUND');
    } else {
      return res.sendFile(path.resolve(url));
    }
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
