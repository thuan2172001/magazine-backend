const mongoose = require('mongoose');

const { Schema } = mongoose;

const counterSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    seq: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Counter', counterSchema);
