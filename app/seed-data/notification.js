import Notification from '../models/notification';
import { createNoti } from '../api/client/notification/notification.service';
import User from '../models/user';

export const generateNotification = async () => {
  try {
    const generateNumber = await Notification.count();

    if (generateNumber > 0) return;

    await createNoti('Tết đến nơi rồi, học hành gì nữa', 'all', true);
    await createNoti('Tết đến nơi rồi, tăng lương cho anh em', 'all', true);
    await createNoti('Tết đến nơi rồi, ăn bánh chưng thôi', 'all', true);
    await createNoti('Tết đến nơi rồi, code gì nữa', 'all', true);
    await createNoti('Tết đến nơi rồi, nghỉ học thôi', 'all', true);
    await createNoti('DONATE: TPBANK: 03479586501', 'all', true);

    const giamdoc = await User.findOne({
      username: 'giamdoc',
    });

    await createNoti('Tết đến nơi rồi, tăng lương đi giám đốc ơiiii', 'productplan', false, giamdoc);

    const kythuat01 = await User.findOne({
      username: 'kythuat01',
    });

    await createNoti('Tết đến nơi rồi, tăng lương đi kỹ thuật ơiiii', 'productplan', false, kythuat01);

    console.log('Seed Notification Success');
  } catch (err) {
    throw new Error(err);
  }
};
