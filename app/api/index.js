import { PROJECT_NAME } from '../environment';

const api = require('express').Router();
const Glob = require('glob');
const path = require('path');

api.get('/', (req, res) => {
  res.json({
    msg: `Welcome to ${PROJECT_NAME}`,
  });
});

const apis = Glob.sync('**/*.controller.js', { cwd: './app/api/' });
apis.map((t) => require(path.resolve(`./app/api/${t}`))).forEach((subApi) => api.use(subApi));

module.exports = api;
