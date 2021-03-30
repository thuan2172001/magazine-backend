import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Faculty from '../models/faculty';
import Student from '../models/student';

const Promise = require('bluebird');

export const generateStudent = async () => {
  try {
    const DataSchema = Student;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('student');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const facultyCode = fields[header.indexOf('faculty')];
      const faculty = await Faculty.findOne({ code: facultyCode });
      console.log(faculty);
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          fullName: fields[header.indexOf('fullname')],
          email: fields[header.indexOf('email')],
          gender: fields[header.indexOf('gender')],
          birthDay: fields[header.indexOf('birthday')],
          code: fields[header.indexOf('code')],
          faculty,
          image: fields[header.indexOf('image')],
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
