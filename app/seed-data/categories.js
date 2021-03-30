import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Category from '../models/category';

const Promise = require('bluebird');

export const generateCategory = async () => {
  try {
    const DataSchema = Category;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('categories');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          category: fields[header.indexOf('category')],
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
