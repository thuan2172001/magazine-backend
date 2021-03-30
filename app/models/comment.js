const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
