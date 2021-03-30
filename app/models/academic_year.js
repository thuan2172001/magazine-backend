import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const AcademicYearSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    closureDate: {
      type: Date,
      required: true,
    },
    finalClosureDate: {
      type: Date,
      required: true,
    },
    alertDays: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

AcademicYearSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('academic-year');
    this.code = nextSeq;
  }
});

const AcademicYear = mongoose.model('AcademicYear', AcademicYearSchema);

module.exports = AcademicYear;
