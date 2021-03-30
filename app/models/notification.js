const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    code: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
