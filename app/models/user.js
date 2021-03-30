import { getNextSequence } from '../api/library/getNextCounter';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    publicKey: {
      type: String,
    },
    encryptedPrivateKey: {
      type: String,
    },
    issuerSignature: {
      type: String,
    },
    issuedPublicKey: {
      type: String,
    },
    tempPassword: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      maxlength: 13,
      unique: true,
    },
    identifier: {
      type: String,
      maxlength: 13,
    },
    email: {
      type: String,
      maxlength: 254,
      required: true,
      unique: true,
    },
    gender: {
      type: String, // 0 : female, 1: male
      required: true,
    },
    birthDay: {
      type: Date,
      required: true,
    },
    // address: {
    //   address: {
    //     type: String,
    //     maxlength: 255,
    //   },
    //   city: {
    //     type: String,
    //     maxlength: 255,
    //   },
    //   district: {
    //     type: String,
    //     maxlength: 255,
    //   },
    //   state: {
    //     type: String,
    //     maxlength: 255,
    //   },
    // },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    image: {
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
    file: [{
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
    status: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('users');
    this.code = nextSeq;
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
