import { parsePaginationOption, SumOption } from '../../library/search';
import Role from '../../../models/role';
import { getSearchOption, mergeSearchObjToPopulate, poppulate } from '../../library/new-search';
import { validateInputString } from '../../../utils/validate-utils';


const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const CODE_NOT_FOUND = 'ROLE.ERROR.CODE_NOT_FOUND';

export const getAll = async (args = {}) => {
  const defaultSortField = 'updatedAt';
  const searchModel = {
    role: 'string',
    code: 'string',
  };
  const poppulateObj = {
  };
  const validSearchOption = getSearchOption(args, searchModel);
  mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, args);
  const paginationOption = parsePaginationOption(args);
  // eslint-disable-next-line no-nested-ternary
  const sortOption = { [args.sortBy ? args.sortBy === '' ? defaultSortField : args.sortBy : defaultSortField]: args.sortType === 'asc' ? 1 : -1 };
  const { page, limit } = paginationOption;
  const skipOptions = limit * (page - 1);

  const [pop] = poppulate(poppulateObj);
  const query = await Role
    .aggregate([...pop, { $sort: sortOption }, { $skip: skipOptions }, { $limit: limit }])
    .collation({
      locale: 'vi',
      numericOrdering: true,
    });
  const total = await Role.aggregate([...pop, SumOption]);
  return {
    data: query,
    paging: { page, limit, total: total.length === 0 ? 0 : total[0].n },
  };
};

export const create = async (args = {}) => {
  const validateArgs = async (arg = {}) => {
    const {
      role,
    } = arg;

    if (validateInputString(role)) throw new Error('CREATE.ERROR.ROLE.NAME_INVALID');
    return {
      ...args,
    };
  };

  const {
    role,
    code,
  } = await validateArgs(args);

  try {
    const newData = new Role({
      role,
      code,
    });

    const data = await newData.save();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const update = async (args = {}) => {
  const data = await Role.findOne({ _id: args.roleId });
  if (!data) throw new Error('ROLE.ERROR.NOT_FOUND');

  const listFiled = [
    'role',
    'code',
  ];

  listFiled.forEach((fieldName) => {
    data[fieldName] = args[fieldName] ?? data[fieldName];
  });
 
  try {
    const newData = await data.save();
    return newData;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getById = async (args = {}) => {
    const { roleId } = args;
    try {
      const result = await Role.findOne({ _id: roleId });
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
};

export const removeById = async (args = {}) => {
  const data = await Role.findOne({ _id: args.roleId });
  if (!data) throw new Error('ROLE.ERROR.NOT_FOUND');
  try {
    if (data) return await Role.findOneAndDelete({ _id: data._id });
    else throw new Error('DELETE.ERROR.CANT_DELETE_STORE_LEVEL');
  } catch (err) {
    throw new Error(err.message);
  }
};

export const remove = async (args = {}) => {
  const validateArgs = (arg = {}) => {

    if (!Array.isArray(arg) && arg.length === 0) throw new Error('DELETE.ERROR.ROLE.ROLE');

    return arg;
  };

  const listRemoveData = validateArgs(args.data);

  try {
    let result = await Promise.all(listRemoveData.map(async (dataId) => {

      if (!await Role.findOneAndDelete({
        _id: dataId,
      })) return { message: 'DELETE.ERROR.ROLE.CANNOT_DELETE', additional: dataId };
      return null;
    }));
    result = result.filter((r) => r != null);
    if (result.length > 0) {
      throw new Error(`${JSON.stringify(result)}`);
    }
    return listRemoveData;
  } catch (err) {
    throw new Error(err.message);
  }
};
