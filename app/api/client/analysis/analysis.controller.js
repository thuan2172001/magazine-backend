import express from 'express';
// eslint-disable-next-line import/named
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';

import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, create, update, removeById, getById, remove,
} from './analysis.service';

// eslint-disable-next-line import/named

const api = express.Router();

api.get('/analysis', async (req, res) => {
  try {
    const args = req.query;
    const { _id } = req.userInfo ?? {};
    const results = await getAll(args, _id);
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/analysis/:academicYearId', async (req, res) => {
  try {
    const args = req.params;
    const result = await getById(args);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
