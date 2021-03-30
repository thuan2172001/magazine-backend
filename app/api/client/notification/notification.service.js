import Notification from '../../../models/notification';
import { ValidateSearchArgs } from '../../library/search';
import User from '../../../models/user';

const { ObjectId } = require('mongoose').Types;

const getAll = async (args, userId) => {
  const defaultSortField = 'updatedAt';

  const validFields = ['code', 'type', 'message', 'isRead', 'to', 'from'];

  const {
    paginationOption,
    sortOption,
    filterOption,
  } = ValidateSearchArgs(
    args,
    validFields,
    defaultSortField,
  );

  const { page, limit } = paginationOption;
  const skipOptions = limit * (page - 1);

  const query = await Notification.find({
    $or: [
      { type: 'all' },
      { to: new ObjectId(userId) },
    ],
  })
    .sort(sortOption)
    .skip(skipOptions)
    .limit(limit);

  const total = await Notification
    .find({
      $or: [
        { type: 'all' },
        { to: new ObjectId(userId) },
      ],
    })
    .sort(sortOption)
    .count({});

  return {
    data: query,
    paging: {
      page,
      limit,
      total,
    },
  };
};

const createNoti = async (message, type, isRead, receivers) => {
  const superUser = await User.findOne({
    username: 'superadmin@gmail.com',
  });

  const notification = new Notification({
    message,
    type,
    to: receivers,
    from: superUser,
    isRead,
  });

  return notification.save();
};

const read = async (args, userId) => {
  const { notificationId } = args;

  try {
    const notification = await Notification.findOne({
      _id: notificationId,
    });

    if (!notification) throw new Error('UPDATE.ERROR.NOTIFICATION.NOTIFICATION_ID_INVALID');

    if (notification.type === 'all') throw new Error('UPDATE.ERROR.NOTIFICATION.CAN_NOT_READ_NOTIFICATION');
    if (notification.isRead === true) throw new Error('UPDATE.ERROR.NOTIFICATION.NOTIFICATION_IS_READ');

    if (notification.to.toString() !== userId.toString()) throw new Error('UPDATE.ERROR.NOTIFICATION.NOTIFICATION_INVALID');

    notification.isRead = true;
    return await notification.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getAll,
  createNoti,
  read,
};
