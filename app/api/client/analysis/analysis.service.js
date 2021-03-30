import { parsePaginationOption, SumOption } from '../../library/search';
import Post from '../../../models/post';
import User from '../../../models/user';
import { getSearchOption, mergeSearchObjToPopulate, poppulate } from '../../library/new-search';

const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
export const getAll = async (args = {}, authId) => {
  // const defaultSortField = 'updatedAt';
  // const searchModel = {
  //   _id: 'string',
  //   startDate: 'date-time',
  //   endDate: 'date-time',
  // };
  // const poppulateObj = {};
  // const vArgs = args;
  // const validSearchOption = getSearchOption(vArgs, searchModel);
  // mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, vArgs);
  const paginationOption = parsePaginationOption(args);
  // // eslint-disable-next-line no-nested-ternary
  // const sortOption = {[args.sortBy ? args.sortBy === '' ? defaultSortField : args.sortBy : defaultSortField]: args.sortType === 'asc' ? 1 : -1};
  const { page, limit } = paginationOption;
  // const skipOptions = limit * (page - 1);
  //
  // const [pop] = poppulate(poppulateObj);
  // const [pop2] = poppulate({
  //
  // });
  // const query = await Post
  //   .aggregate([...pop, {$sort: sortOption}, {$skip: skipOptions}, {$limit: limit}])
  //   .collation({
  //     locale: 'vi',
  //     numericOrdering: true,
  //   });
  //
  const poppulateObj = { academicYear: { __from: 'academicyears' } };
  const [pop] = poppulate(poppulateObj);
  const query = await Post
    .aggregate([...pop,
      {
        $group: {
          _id: { academicYear: '$academicYear', user: '$user' },
          totalPost: { $sum: 1 },
          acceptedPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'accept'] }, 1, 0,
              ],
            },
          },
          pendingPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] }, 1, 0,
              ],
            },
          },
          rejectPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'reject'] }, 1, 0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.academicYear',
          totalStudent: { $sum: 1 },
          totalPost: { $sum: '$totalPost' },
          acceptedPost: { $sum: '$acceptedPost' },
          rejectPost: { $sum: '$rejectPost' },
          pendingPost: { $sum: '$pendingPost' },
        },
      },
    ]);
  const sumInfo = await Post
    .aggregate([...pop,
      {
        $group: {
          _id: null,
          totalPost: { $sum: 1 },
          acceptedPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'accept'] }, 1, 0,
              ],
            },
          },
          pendingPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] }, 1, 0,
              ],
            },
          },
          rejectPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'reject'] }, 1, 0,
              ],
            },
          },
        },
      }]);
  const total = await Post.aggregate([...pop, SumOption]);
  return {
    data: [query, sumInfo],
    // data: query,
    // paging: {page, limit, total: total.length === 0 ? 0 : total[0].n},
  };
};

export const getById = async (args = {}) => {
  const searchModel = {
    academicYear: { _id: 'objectId' },
  };
  const poppulateObj = { user: { __from: 'users', faculty: { __from: 'faculties' } }, academicYear: { __from: 'academicyears' } };
  const vArgs = { 'academicYear._id': args.academicYearId };
  const validSearchOption = getSearchOption(vArgs, searchModel);
  mergeSearchObjToPopulate(validSearchOption, poppulateObj, searchModel, vArgs);
  const [pop] = poppulate(poppulateObj);
  const facultyData = await Post
    .aggregate([...pop,
      {
        $group: {
          _id: { faculty: '$user.faculty', user: '$user._id' },
          totalPost: { $sum: 1 },
          acceptedPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'accept'] }, 1, 0,
              ],
            },
          },
          pendingPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] }, 1, 0,
              ],
            },
          },
          rejectPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'reject'] }, 1, 0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.faculty',
          totalStudent: { $sum: 1 },
          totalPost: { $sum: '$totalPost' },
          acceptedPost: { $sum: '$acceptedPost' },
          rejectPost: { $sum: '$rejectPost' },
          pendingPost: { $sum: '$pendingPost' },
        },
      },
    ]);
  const sumInfo = await Post
    .aggregate([...pop,
      {
        $group: {
          _id: { academicYear: '$academicYear', user: '$user' },
          totalPost: { $sum: 1 },
          acceptedPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'accept'] }, 1, 0,
              ],
            },
          },
          pendingPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] }, 1, 0,
              ],
            },
          },
          rejectPost: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'reject'] }, 1, 0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: { academicYear: '$_id.academicYear' },
          totalStudent: { $sum: 1 },
          totalPost: { $sum: '$totalPost' },
          acceptedPost: { $sum: '$acceptedPost' },
          rejectPost: { $sum: '$rejectPost' },
          pendingPost: { $sum: '$pendingPost' },
        },
      }]);
  return {
    data: [facultyData, sumInfo],
    // paging: {page, limit, total: total.length === 0 ? 0 : total[0].n},
  };
};
