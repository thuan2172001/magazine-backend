import express from 'express';
// eslint-disable-next-line import/named
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';

import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, create, update, removeById, getById, remove,
} from './category.service';

// eslint-disable-next-line import/named

const api = express.Router();

api.get('/category', CheckAuth, async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args);
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/category/:categoryId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await getById(args);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/category', CheckAuth, async (req, res) => {
  try {
    const args = req.body;
    const results = await create(args);
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/category/:categoryId', CheckAuth, async (req, res) => {
  try {
    const { categoryId } = req.params;

    const args = req.body;

    const result = await update({
      categoryId, ...args,
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/category/bulk', CheckAuth, async (req, res) => {
  try {
    const result = await remove(req.body);

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/category/:categoryId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await removeById({ ...args });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
