import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';

const Promise = require('bluebird');

export const generateComment = async () => {
  try {
    const DataSchema = Comment;
    const generateNumber = await DataSchema.count();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('comments');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const postCode = fields[header.indexOf('post')];
      const post = await Post.findOne({ code: postCode });
      const userCode = fields[header.indexOf('user')];
      const user = await User.findOne({ code: userCode });

      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          user,
          post,
          code: fields[header.indexOf('code')],
          content: fields[header.indexOf('content')],
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
