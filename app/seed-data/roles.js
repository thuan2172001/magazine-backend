import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Role from '../models/role';

const Promise = require('bluebird');

export const generateRole = async () => {
  try {
    const DataSchema = Role;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('roles');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          role: fields[header.indexOf('role')],
        };
        const data = new DataSchema(_data);

        await data.save();
      }
    });
  } catch
  (err) {
    throw new Error(err.message);
  }
};
