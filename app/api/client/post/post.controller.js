import express from 'express';
// eslint-disable-next-line import/named
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';

import {
  success,
} from '../../../utils/response-utils';
import {
  getAll, create, update, removeById, getById, remove,
} from './post.service';
import { postComment } from './postComment';

// eslint-disable-next-line import/named

const api = express.Router();
api.put('/post/:postId/comments', CheckAuth, async (req, res) => {
  try {
    const { _id } = req.userInfo;
    const args = req.params;
    const { body } = req;
    console.log(req);
    const result = await postComment(args, body, _id);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/post', CheckAuth, async (req, res) => {
  try {
    const args = req.query;
    const { _id } = req.userInfo;
    const results = await getAll(args, _id);
    return res.json(success(results));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.get('/post/:postId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await getById(args);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.post('/post', CheckAuth, async (req, res) => {
  try {
    const args = req.body;
    const result = await create({ ...args, userInfo: req.userInfo });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.put('/post/:postId', CheckAuth, async (req, res) => {
  try {
    const { postId } = req.params;

    const args = req.body;
    const result = await update({ ...args, postId, userInfo: req.userInfo });
    console.log(result);
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/post/bulk', CheckAuth, async (req, res) => {
  try {
    const args = req.body;
    const result = await remove({ ...args, userInfo: req.userInfo });

    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

api.delete('/post/:postId', CheckAuth, async (req, res) => {
  try {
    const args = req.params;
    const result = await removeById({ ...args, userInfo: req.userInfo });
    return res.json(success(result));
  } catch (err) {
    return CommonError(req, err, res);
  }
});

module.exports = api;
