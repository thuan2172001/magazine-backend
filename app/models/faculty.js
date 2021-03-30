import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const FacultySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    faculty: {
      type: String,
      required: true,
      maxlength: 254,
    },
  },
  { timestamps: true },
);

FacultySchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('faculties');
    this.code = nextSeq;
  }
});
const Faculty = mongoose.model('Faculty', FacultySchema);

module.exports = Faculty;
