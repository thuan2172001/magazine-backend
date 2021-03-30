import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import School from '../models/school';

const Promise = require('bluebird');

export const generateSchool = async () => {
  try {
    const DataSchema = School;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;

    const fileData = await getCSVFiles('school');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          schoolName: fields[header.indexOf('schoolName')],
          email: fields[header.indexOf('email')],
          location: fields[header.indexOf('location')],
          code: fields[header.indexOf('code')],
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
