import { parsePaginationOption, SumOption } from '../../library/search';
import { getSearchOption, mergeSearchObjToPopulate, poppulate } from '../../library/new-search';
import {saveImageAndGetHash, saveImageAndGetHashList} from '../../../utils/image-utils';
import {saveFileAndGetHash, saveFileAndGetHashList} from "../../../utils/upload-file-utils";


const Promise = require('bluebird');
const _ = require('lodash');

const mongoose = require('mongoose');

const User = mongoose.model('User');

const getUserByUserName = async (args = {}) => {
  const validate = (arg = {}) => {
    const { username } = arg;
    return username;
  };

  const vUserName = validate(args);

  return User.findOne({ username: vUserName });
};

const getUserByPhone = async (args = {}) => {
  const validate = (arg = {}) => {
    const { phone } = arg;

    if (!phone) throw new Error('Phone must be not empty');

    return phone;
  };

  const vPhone = validate(args);

  return User.findOne({ phone: vPhone }).populate(['role']);
};

const getUserByEmail = async (args = {}) => {
  const validate = (arg = {}) => {
    const { email } = arg;

    if (!email) throw new Error('Email must be not empty');

    return email;
  };

  const vEmail = validate(args);

  return User.findOne({ email: vEmail });
};

const getById = async (args = {}) => {
  const validateArgs = (arg = {}) => {
    const { userId } = arg;

    if (!userId) throw new Error('GET.ERROR.USER.USER_ID_NOT_FOUND');

    return userId;
  };

  const vUserId = validateArgs(args);

  try {
    let user = await User.findOne({ _id: vUserId }).
    populate(['faculty', 'role']).lean();
    return user
  } catch (e) {
    throw new Error(e.message);
  }
};

const update = async (args = {}) => {
  // const validateArgs = async (arg = {}) => {
  //   const {
  //     fullName,
  //     gender,
  //     role,
  //     faculty
  //   } = arg;
  //
  //   if (fullName && (typeof fullName !== 'string' || (fullName.length === 0 || fullName.length > 254))) throw new Error('UPDATE.ERROR.USER.FULL_NAME_INVALID');
  //
  //   if (gender && (typeof gender !== 'string' || (gender !== '0' && gender !== '1'))) throw new Error('CREATE.ERROR.USER.GENDER_INVALID');
  //
  //   if (role && (typeof role !== 'string' ||
  //       (role !== 'student' && role !== 'coordinator' && role !== 'manager')))
  //     throw new Error('CREATE.ERROR.USER.GENDER_INVALID');
  //
  //   return arg;
  // };

  const { userId } = args;

  // const vArgs = await validateArgs(args);
  //
  // // Check email of user
  // if (vArgs.email) {
  //   if (typeof vArgs.email !== 'string' || (vArgs.email.length === 0 || vArgs.email.length > 80)) throw new Error('UPDATE.ERROR.USER.EMAIL_INVALID');
  //   const checkEmail = await getUserByEmail({ email: vArgs.email });
  //
  //   if (checkEmail && checkEmail._id.toString() !== userId) throw new Error('UPDATE.ERROR.USER.EMAIL_IN_USE');
  // }
  //
  // // Check phone of user
  // if (vArgs.phone) {
  //   if (typeof vArgs.phone !== 'string' || (vArgs.phone.length === 0 || vArgs.phone.length > 80)) throw new Error('UPDATE.ERROR.USER.PHONE_INVALID');
  //   const checkPhone = await getUserByPhone({ phone: vArgs.phone });
  //
  //   if (checkPhone && checkPhone._id.toString() !== userId) throw new Error('UPDATE.ERROR.USER.PHONE_IN_USE');
  // }

  if (!userId) throw new Error('UPDATE.ERROR.USER.USER_ID_INVALID');

  const user = await User.findOne({ _id: userId });

  if (!user) throw new Error('UPDATE.ERROR.USER.USER_NOT_FOUND');


  const listFiled = [
    'username',
    'fullName',
    'email',
    'phone',
    'gender',
    'birthDay',
    'role',
    'faculty',
    'identifier',
    'status',
  ];

  listFiled.forEach((fieldName) => {
    user[fieldName] = args[fieldName] ?? user[fieldName];
  });

  if (args.image) {
    user.image = await saveImageAndGetHash(args.image);
  }

  if (args.file) {
    user.file = await saveFileAndGetHashList(args.file);
  }

  return user.save();
};

const removeById = async (args = {}) => {
  const validateArgs = (arg = {}) => {
    const { userId, actionType, realMethod } = arg;

    if (!userId) throw new Error('User ID must not be empty');
    // console.log(args)
    // if (typeof actionType !== 'string' || actionType.length === 0) {
    //   throw new Error('Action Type is required.');
    // }
    // if (actionType.trim().toLowerCase() !== realMethod.toLowerCase()) {
    //   throw new Error('Action Type is invalid.');
    // }

    return userId;
  };

  const vUserId = validateArgs(args);

  return User.deleteOne({ _id: vUserId });
};

const getAll = async (args = {}) => {
  const defaultSortField = 'updatedAt';
  const searchModel = {
    phone: 'string',
    email: 'string',
    fullName: 'string',
    code: 'string',
    username: 'string',
    identifier: 'string',
    status: 'boolean',
    faculty: { _id: 'objectId' },
    role: { _id: 'objectId' },
  };
  const poppulateObj = {
    faculty: { __from: 'faculties' },
    role: { __from: 'roles' },
  };
  const validSearchOption = getSearchOption(args, searchModel);
  mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, args);
  const paginationOption = parsePaginationOption(args);
  const sortOption = { [args.sortBy ? args.sortBy === '' ? defaultSortField : args.sortBy : defaultSortField]: args.sortType === 'asc' ? 1 : -1 };
  const { page, limit } = paginationOption;
  const skipOptions = limit * (page - 1);

  const [pop] = poppulate(poppulateObj);
  const query = await User.aggregate([...pop, { $sort: sortOption }, { $skip: skipOptions }, { $limit: limit }]).collation({
    locale: 'vi',
    numericOrdering: true,
  });
  const total = await User.aggregate([...pop, SumOption]);
  return {
    data: query,
    paging: { page, limit, total: total.length === 0 ? 0 : total[0].n },
  };
};


const create = async (args = {}) => {
  const validateArgs = async (arg = {}) => {
    const {
      username,
      fullName,
      phone,
      email,
      birthDay,
      gender,
      role,
        identifier,
        status,
      faculty,
      code,
    } = arg;

    Object.keys(args).forEach((key) => {
      if (_.isNull(args[key]) || args[key] === '') {
        throw new Error(`Property "${key}" empty/null`);
      }
    });

    if (typeof gender !== 'string' || (gender !== '0' && gender !== '1')) throw new Error('CREATE.ERROR.USER.GENDER_INVALID');

    if (typeof fullName !== 'string' || (fullName.length === 0 || fullName.length > 254)) throw new Error('CREATE.ERROR.USER.FULL_NAME_INVALID');
    if (!birthDay) throw new Error('CREATE.ERROR.USER.BIRTH_DAY_INVALID');

    // Check Phone of user
    if (typeof phone !== 'string' || (phone.length === 0 || phone.length > 13)) throw new Error('CREATE.ERROR.USER.PHONE_INVALID');
    const checkPhone = await getUserByPhone({ phone });
    if (checkPhone) throw new Error('CREATE.ERROR.USER.PHONE_IN_USE');

    // Check Email of User
    if (typeof email !== 'string' || (email.length === 0 || email.length > 254)) throw new Error('CREATE.ERROR.USER.EMAIL_INVALID');
    const checkEmail = await getUserByEmail({ email });
    if (checkEmail) throw new Error('CREATE.ERROR.USER.EMAIL_IN_USE');

    // Check role
    if (_.isEmpty(role)) {
      throw new Error('CREATE.ERROR.USER.ROLE_IN_VALID');
    }

    return arg;
  };

  const {
    username,
    publicKey,
      faculty,
    encryptedPrivateKey,
    issuerSignature,
    issuedPublicKey,
    tempPassword,
    fullName,
    birthDay,
    gender,
    phone,
      identifier,
      status,
    email,
    role,
    image,
      file,
  } = await validateArgs(args);
  let savedImage = null;
  if (image) {
    savedImage = await saveImageAndGetHash(image);
  }

  let saveFile = null;
  if (file) {
    saveFile = await saveFileAndGetHash(file);
  }

  const newUser = new User({
    username: email,
    publicKey: publicKey || 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
    encryptedPrivateKey: encryptedPrivateKey || 'U2FsdGVkX1849aMg8O6GLRVrFSLd2aQI4cRaS4Ql2nZr8p+smv5O9koFn+J6EkcwaZF6u8dGb3tJEXg35q0raA==',
    issuerSignature: issuerSignature || 'Admin System',
    issuedPublicKey: issuedPublicKey || 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
    tempPassword,
    fullName,
    phone,
    birthDay,
    identifier,
    status,
    gender,
    email,
    role,
    faculty,
    image : savedImage,
    file: saveFile,
  });

  return newUser.save();
};

module.exports = {
  getById,
  update,
  removeById,
  getAll,
  create,
};
