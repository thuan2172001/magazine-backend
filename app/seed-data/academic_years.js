import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import AcademicYear from '../models/academic_year';

const Promise = require('bluebird');

export const generateAcademicYear = async () => {
  try {
    const DataSchema = AcademicYear;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('academicyear');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          startDate: fields[header.indexOf('startDate')],
          closureDate: fields[header.indexOf('closureDate')],
          finalClosureDate: fields[header.indexOf('finalClosureDate')],
          alertDays: fields[header.indexOf('alertDays')],
          name: fields[header.indexOf('name')],
          status: fields[header.indexOf('status')],
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
