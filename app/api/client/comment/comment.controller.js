import express from 'express';
// eslint-disable-next-line import/named
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';

import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, create, update, removeById, getById, remove,
} from './comment.service';

// eslint-disable-next-line import/named

const api = express.Router();

api.get('/comment', CheckAuth, async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args);
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/comment/:commentId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await getById(args);
    console.log(result);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/comment', CheckAuth, async (req, res) => {
  try {
    const args = req.body;
    const result = await create({ ...args, userInfo: req.userInfo });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/comment/:commentId', CheckAuth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const args = req.body;
    const result = await update({ ...args, commentId, userInfo: req.userInfo });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/comment/bulk', CheckAuth, async (req, res) => {
  try {
    const result = await remove(req.body);

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/comment/:commentId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await removeById({ ...args });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
