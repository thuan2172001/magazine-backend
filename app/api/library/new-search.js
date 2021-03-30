import _ from 'lodash';
import moment from 'moment';
import { parsePaginationOption } from './search';

const { ObjectId } = require('mongoose').Types;

export const getFieldV3 = (field, fieldName) => {
  if (fieldName === '') return [field];
  const ifNested = (fN) => fN.indexOf('.') === -1;
  const ifArray = (k) => k.indexOf('[') > -1;
  if (ifNested(fieldName)) {
    return [field[fieldName]];
  }
  const arrName = fieldName.split('.');
  let fields = [field];
  arrName.forEach((k) => {
    const newFields = [];
    let key = k;
    if (ifArray(key)) {
      key = key.substring(1, key.length - 1);
      fields.forEach((f) => {
        if (f[key]) newFields.push(...f[key]);
      });
    } else {
      fields.forEach((f) => {
        if (f[key]) newFields.push(f[key]);
      });
    }
    fields = newFields;
  });
  return fields;
};

export const getSearchOption = (args, searchModel) => Object.keys(args).filter((key) => {
  const obj = getFieldV3(searchModel, key)[0];
  return (obj && _.isString(obj));
});

export const convertToSearchQuery = (key, value, type) => {
  const trimValue = _.isString(value) ? value.trim() : value;
  if (trimValue === '') return [];
  switch (type) {
    case 'string': {
      const parse = trimValue.replace(/([!@#$%^&*()+=[\]\\';,./{}|":<>?~_-])/g, '\\$&');
      return [{ $match: { [key]: { $regex: new RegExp(parse, 'mi') } } }];
    }
    case 'objectId':
      return [{ $match: { [key]: new ObjectId(trimValue) } }];
    case 'objectId-contain': {
      const parse = trimValue.replace(/([!@#$%^&*()+=[\]\\';,./{}|":<>?~_-])/g, '\\$&');
      return [{ $project: { [`_${key}`]: { $toString: `$${key}` } } },
        { $match: { [`_${key}`]: { $regex: new RegExp(parse, 'mi') } } }];
    }
    case 'boolean':
      return [{ $match: { [key]: trimValue === 'true' } }];
    case 'number':
      return [{ $match: { [key]: trimValue } }];
    case 'string-array':
      return [{ $match: { [key]: { $in: trimValue.split(',') } } }];
    case 'date-time':
      if (Array.isArray(trimValue)) {
        const sortValue = trimValue.sort((a, b) => moment(a).diff(b));
        return [{
          $match: {
            [key]: {
              $lt: moment(sortValue[1])
                .add(1, 'day')
                .toDate(),
              $gte: moment(sortValue[0])
                .toDate(),
            },
          },
        }];
      }
      return [{
        $match: {
          [key]: {
            $lt: moment(trimValue)
              .add(1, 'day')
              .toDate(),
            $gte: moment(trimValue)
              .toDate(),
          },
        },
      }];

    default:
      throw new Error('Invalid Search Type');
  }
};

export const mergeSearchObjToPopulate = (validSearchOption, poppulateObj, searchModel, requestArgs) => {
  validSearchOption.forEach((s) => {
    const parseSearch = s.split('.');
    const key = parseSearch.pop();
    const pathSearch = parseSearch.join('.');
    const [popObj] = getFieldV3(poppulateObj, pathSearch);
    if (!popObj) throw new Error(`Populate and ValidSearch Mismatch ${s}`);
    popObj.__search = _.merge(popObj.__search, { [key]: { value: requestArgs[s], type: getFieldV3(searchModel, s)[0] } });
  });
};

export const poppulate = (poppulateObj) => {
  const result = [];
  const {
    __search, __select, __unSelect, ...pp
  } = poppulateObj;
  const searchQuery = __search ? Object.keys(__search).map((s) => convertToSearchQuery(s, __search[s].value, __search[s].type)) : [[]];
  const project = {};
  if (_.isArray(__select)) {
    __select.forEach((s) => {
      project[s] = 1;
    });
  }
  if (_.isArray(__unSelect)) {
    __unSelect.forEach((s) => {
      project[s] = 0;
    });
  }
  if (Object.keys(project).length > 0) result.push({ $project: project });
  result.push(...searchQuery.reduce((pre, cur) => {
    pre.push(...cur);
    return pre;
  }, []));
  let isSearched = !((__search == null || __search.length === 0));
  Object.keys(pp).forEach((pK) => {
    const {
      __from, __isArray, __isChecked, ...pop
    } = pp[pK];
    if (!__from) throw new Error('Dùng sai cách');
    if (__isChecked) return; // TODO: Optimize count with this variable
    const [nestedPop, isNestedSearched] = poppulate(pop);
    result.push({
      $lookup: {
        from: __from,
        let: { [`${pK}`]: `$${pK}` },
        pipeline: [
          { $match: { $expr: { [__isArray === true ? '$in' : '$eq']: ['$_id', `$$${pK}`] } } },
          ...nestedPop,
        ],
        as: pK,
      },
    });
    isSearched = isSearched || isNestedSearched;
    if (__isArray === true);
    else result.push({ $unwind: { path: `$${pK}`, preserveNullAndEmptyArrays: !isNestedSearched } });
  });
  return [result, isSearched];
};
export const searchFunction = (args, defaultSortField, searchModel, poppulateObj) => {
  const validSearchOption = getSearchOption(args, searchModel);
  mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, args);
  const paginationOption = parsePaginationOption(args);
  const { page, limit } = paginationOption;
  const skipOptions = limit * (page - 1);

  const sortOption = { [args.sortBy ? args.sortBy === '' ? defaultSortField : args.sortBy : defaultSortField]: args.sortType === 'asc' ? 1 : -1 };
  const [pop] = poppulate(poppulateObj);

  return {
    pop,
    sortOption,
    skipOptions,
    page,
    limit,
  };
};
