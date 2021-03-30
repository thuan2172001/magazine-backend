import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Faculty from '../models/faculty';
import User from '../models/user';

const Promise = require('bluebird');

export const generateFaculty = async () => {
  try {
    const DataSchema = Faculty;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('faculties');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      const userCode = fields[header.indexOf('user')];
      const user = await User.findOne({ code: userCode });
      console.log(user);

      if (!checkDataExits) {
        const _data = {
          faculty: fields[header.indexOf('faculty')],
          user,
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
