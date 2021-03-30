import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, getById, create, update, remove, removeById,
} from './role.service';

const api = express.Router();

api.get('/role/count', CheckAuth, async (req, res) => {
  try {
    const args = req.query;
    const results = await getAll(args);

    return res.json(success(results.length));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/role', CheckAuth, async (req, res) => {
  try {
    const args = req.query;

    const results = await getAll(args);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/role/:roleId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;

    const result = await getById(args);

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/role', CheckAuth, async (req, res) => {
  try {
    const args = req.body;

    const results = await create(args);

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/role/:roleId', CheckAuth, async (req, res) => {
  try {
    const args = req.body;

    const { roleId } = req.params;

    const results = await update({ ...args, roleId });

    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/role/bulk', CheckAuth, async (req, res) => {
  try {
    const { listRole } = req.body;

    const result = await remove({
      listRole,
    });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/role/:roleId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;

    const result = await removeById({ ...args });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
