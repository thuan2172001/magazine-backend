import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    role: {
      type: String,
      maxlength: 254,
    },
    code: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

RoleSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('roles');
    this.code = nextSeq;
  }
});

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
