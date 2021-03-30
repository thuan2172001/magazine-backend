import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Post from '../models/post';
import Category from '../models/category';
import User from '../models/user';
import AcademicYear from '../models/academic_year';

const Promise = require('bluebird');

export const generatePost = async () => {
  try {
    const DataSchema = Post;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('posts');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const categoryCode = fields[header.indexOf('category')];
      const category = await Category.findOne({ code: categoryCode });
      const userCode = fields[header.indexOf('user')];
      const user = await User.findOne({ code: userCode });
      const academicYearCode = fields[header.indexOf('academic_year')];
      const academicYear = await AcademicYear.findOne({ code: academicYearCode });

      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          title: fields[header.indexOf('title')],
          user,
          date_upload: fields[header.indexOf('date_upload')],
          category,
          status: fields[header.indexOf('status')],
          file: fields[header.indexOf('file')],
          academicYear,
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
