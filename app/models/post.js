import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicYear: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 254,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    date_upload: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      maxlength: 254,
      required: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    image: [{
      path: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      hash: {
        type: String,
      },
    }],
    comments: [{
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
      },
      content: {
        type: String,
        required: true,
        maxlength: 1000,
      },
    }],
    file: {
      path: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      hash: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

PostSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('posts');
    this.code = nextSeq;
  }
});
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
