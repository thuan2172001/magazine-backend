import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Faculty from '../models/faculty';
import User from '../models/user';

const Promise = require('bluebird');

export const updateFaculty = async () => {
  try {
    const DataSchema = Faculty;

    const fileData = await getCSVFiles('faculties');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      let checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      const userCode = fields[header.indexOf('user')];
      const user = await User.findOne({ code: userCode }).populate(['role']);

      checkDataExits = { ...checkDataExits, user };
      const res = await checkDataExits.save();
      console.log(res);
    });
  } catch
  (err) {
    throw new Error(err.message);
  }
};
