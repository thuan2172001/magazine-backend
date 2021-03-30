import _ from 'lodash';
import {BLOCKCHAIN_URL, CHECK_BLOCKCHAIN, PREFIX_BLOCKCHAIN_ID} from '../../environment';

const apiSender = require('../api-sender');
const {encryptMD5} = require('../../utils/crypto-utils');

const BLOCKCHAIN_DB_URL = BLOCKCHAIN_URL ?? 'http://13.212.72.170:8000';

const hashObject = (obj) => {
  if (_.isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      obj[key] = hashObject(obj[key]);
    });
    return obj;
  }
  if (_.isArray(obj)) {
    return obj.map(v => hashObject(v));
  }
  return encryptMD5(obj);
}

const splitObject = (obj, path = '') => {
  const origin = {path: path, data: {}};
  const result = [origin];
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (_.isObject(val) && _.isString(val._id)) {
      result.push(...splitObject(val, `${path}.${key}`));
      origin.data[key] = val._id;
    } else if (_.isArray(val)) {
      origin.data[key] = val.map((v, index) => {
        if (_.isString(v._id)) {
          result.push(...splitObject(v, `${path}.${key}[${index}]`));
          return v._id;
        }
        return v;
      })
    } else {
      origin.data[key] = val;
    }
  });
  return result;
};

export const updateToBlockchain = async (obj) => {
  if (CHECK_BLOCKCHAIN === 'true' || CHECK_BLOCKCHAIN === true) {
    const hash = hashObject(JSON.parse(JSON.stringify(obj)));
    console.log('hash', hash);
    const objs = splitObject(hash);
    console.log('objs', objs);
    return Promise.all(objs.map((object) => {
      console.log(object)
      const hashObjString = JSON.stringify(object.data);
      const path = `/api/data-hash/${PREFIX_BLOCKCHAIN_ID ?? ''}${object.data._id}`;
      const route = BLOCKCHAIN_DB_URL + path;
      const payload = {
        farmId: 'Farm-ID',
        dataId: `${PREFIX_BLOCKCHAIN_ID ?? ''}${object.data._id}`,
        dataHash: hashObjString,
        dataType: '_' + object.path,
      }
      return apiSender.postJSON(route, payload);
    }))
      .catch((error) => {
        console.log(error.message);
        throw new Error(error.message);
      });
  }
};

const compareObjHash = (blockchainHash, obj, path = '_') => {
  if (_.isObject(obj)) {
    return Object.keys(obj).forEach((key) => {
      compareObjHash(blockchainHash[key], obj[key], `${path}.${key}`);
    })
  }
  if (_.isArray(obj)) {
    return obj.forEach((v, index) => {
      compareObjHash(blockchainHash[index], v, `${path}[${index}]`);
    });
  }
  if (obj !== blockchainHash) {
    const err = {
      message: 'BLOCKCHAIN_MISS_MATCH', additional: {
        blockchainValue: blockchainHash,
        objectValue: obj,
        path: path
      }
    };
    throw new Error(JSON.stringify([err]));
  }
};

export const compareWithBlockchain = async (obj) => {
  if (CHECK_BLOCKCHAIN === 'true' || CHECK_BLOCKCHAIN === true) {
    console.log(obj)
    const hash = hashObject(JSON.parse(JSON.stringify(obj)));
    // console.log('hash', hash);
    // console.log('hash', hash.seeding.farmLocation);
    const objs = splitObject(hash);
    // console.log('objs', objs);
    await Promise.all(objs.map((object) => {
      const path = `/api/data-hash/${PREFIX_BLOCKCHAIN_ID ?? ''}${object.data._id}`;
      const route = BLOCKCHAIN_DB_URL + path;
      return apiSender.getJSON(route)
        .then((response) => {
          compareObjHash(JSON.parse(response.dataHash), object.data, object.path);
        })
        .catch((error) => {
          console.log('error------------------', object.path);
          console.log('object.', object.data);
          console.log(error)
          throw new Error(error.message);
        });
    })).catch((error) => {
      throw new Error(error.message);
    });
  }
  return true;
};
