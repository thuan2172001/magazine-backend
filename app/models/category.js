import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      maxlength: 254,
    },
  },
  { timestamps: true },
);

CategorySchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('categories');
    this.code = nextSeq;
  }
});
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
