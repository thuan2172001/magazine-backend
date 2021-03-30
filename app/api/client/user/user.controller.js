import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import {
  getAll,
  getById,
  create,
  removeById,
  update,
} from './user.service';
import CommonError from '../../library/error';

const {
  success,
} = require('../../../utils/response-utils');

const api = express.Router();

api.get('/user', CheckAuth, async (req, res) => {
  try {
    const args = req.query;

    const results = await getAll(args);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});
api.get('/user/me', CheckAuth, async (req, res) => {
  try {
    const args = req.query;
    // TODO : lấy _id từ token và thay args bằng user id
    const results = await getById(args);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});
api.get('/user/:userId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;

    const result = await getById(args);

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/user', async (req, res) => {
  try {
    const args = req.body;

    const realMethod = req.method;

    const results = await create({ realMethod, ...args });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/user/:userId', async (req, res) => {
  try {
    const args = req.params;

    const { actionType } = req.body;

    const realMethod = req.method;

    const result = await removeById({ actionType, realMethod, ...args });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/user/:userId', CheckAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const realMethod = req.method;
    console.log(realMethod);
    const args = req.body;
    console.log(args);
    const result = await update({ userId, realMethod, ...args });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
