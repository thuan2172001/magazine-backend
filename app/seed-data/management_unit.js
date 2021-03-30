import ManagementUnit from '../models/management_unit';
import User from '../models/user';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

const createRootManagementUnit = () => {
  const managementUnit = new ManagementUnit({
    name: 'Root',
    level: 0,
    parent: null,
  });

  return managementUnit.save();
};

export const generateManagementUnit = async () => {
  try {
    const generateNumber = await ManagementUnit.count();

    if (generateNumber > 0) return;

    const isGenerated = await ManagementUnit.findOne({ name: 'Root' });
    if (!isGenerated) {
      const rootManagementUnit = await createRootManagementUnit();

      const managementFile = await getCSVFiles('managementunits');

      let { header, content } = await getContentCSVFiles(managementFile[0]);

      content = content.slice(1);
      await Promise.each(content, async (line) => {
        const field = cleanField(line.split(','));

        const checkManagementExits = await ManagementUnit.findOne({
          name: field[header.indexOf('name')],
          level: field[header.indexOf('level')],
          parent: [rootManagementUnit._id],
        });

        if (!checkManagementExits) {
          const managementUnit = new ManagementUnit({
            name: field[header.indexOf('name')],
            level: field[header.indexOf('level')],
            parent: [rootManagementUnit._id],
          });
          await managementUnit.save();
        }
      });

      console.log('Seed Management Unit Success');
    }
  } catch
  (err) {
    throw new Error(err.message);
  }
};

export const generateManagementUnitForUser = async () => {
  try {
    const cuahangUnit = await ManagementUnit.findOne({
      name: 'Tổng giám đốc',
    });
    await User.findOneAndUpdate({
      username: 'admin',
    }, { managementUnit: cuahangUnit });

    const donvivanchuyenUnit = await ManagementUnit.findOne({
      name: 'Đơn vị vận chuyển',
    });
    await User.findOneAndUpdate({
      username: 'Shipper01',
    }, { managementUnit: donvivanchuyenUnit });
    await User.findOneAndUpdate({
      username: 'Shipper02',
    }, { managementUnit: donvivanchuyenUnit });
  } catch (e) {
    throw new Error(e.message);
  }
};
