import Post from '../../../models/post';
import { createNoti } from '../notification/notification.service';

const postComment = async (args = {}, body, user) => {
  const validateArgs = (arg = {}) => {
    const { postId } = arg;
    if (!postId) throw new Error('FIND.ERROR.POST_ID_NOT_FOUND');
    return arg;
  };
  const validateBody = (bodyArgs = {}) => {
    const { content } = bodyArgs;
    if (!content) throw new Error('FIND.ERROR.MESSAGE_CANNOT_BE_EMPTY');
    return bodyArgs;
  };
  const { postId } = await validateArgs(args);
  const { content } = await validateBody(body);
  try {
    const post = await Post.findOne({ _id: postId }).populate('content');
    if (post) {
      const { comments } = post;
      comments.push({
        createdBy: user,
        createdAt: new Date(),
        content,
      });
      post.comments = comments;
      await post.save();
      const newPost = await Post.findOne({ _id: postId }).populate({
        path: 'comments',
        select: [
          'fullName',
        ],
        populate: {
          path: 'createdBy',
          select: ['fullName'],
        },
      }).select(['comments', 'code']);
      await createNoti(`Bài đăng ${newPost.code} có comment mới`, 'all', true);
      return newPost.comments;
      // return newPost.comments;
    }
    throw new Error('FIND.ERROR.POST.POST_NOT_FOUND');
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  postComment,
};
