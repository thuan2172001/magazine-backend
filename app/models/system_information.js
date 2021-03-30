const mongoose = require('mongoose');

const { Schema } = mongoose;

const SystemInformationSchema = new Schema(
  {
    version: String,
    seedHash: String,
  },
  { timestamps: true },
);
const SystemInformation = mongoose.model('SystemInformation', SystemInformationSchema);

module.exports = SystemInformation;
