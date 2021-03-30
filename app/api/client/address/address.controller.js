const api = require('express').Router();
const { error } = require('../../../services/logger');
const {
  success,
  badRequest,
  serverError,
} = require('../../../utils/response-utils');
const cityList = require('../../../const/city.json');
const stateList = require('../../../const/state.json');
const districtList = require('../../../const/district.json');

api.get('/address/get-state', async (req, res) => {
  try {
    const stateArr = [];
    for (const key in stateList) {
      stateArr.push(stateList[key]);
    }
    return res.json(success(stateArr));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
api.get('/address/get-city', async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) {
      return res.json(badRequest('GET.ERROR.INVALID_STATE'));
    }
    const cityArr = [];
    for (const key in cityList) {
      if (cityList[key].parent_code === state) {
        cityArr.push(cityList[key]);
      }
    }
    return res.json(success(cityArr));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});
api.get('/address/get-district', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.json(badRequest('GET.ERROR.INVALID_CITY'));
    }
    const districtArr = [];
    for (const key in districtList) {
      if (districtList[key].parent_code === city) {
        districtArr.push(districtList[key]);
      }
    }
    return res.json(success(districtArr));
  } catch (err) {
    error(`${req.method} ${req.originalUrl}`, err.message);
    return res.json(serverError(err.message));
  }
});

module.exports = api;
