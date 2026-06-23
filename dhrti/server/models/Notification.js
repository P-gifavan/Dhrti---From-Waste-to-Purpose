const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'order_received',
        'order_accepted',
        'order_rejected',
        'payment_completed',
        'shipment_updated',
        'verification_approved',
        'verification_rejected',
        'review_received',
        'system'
      ],
      default: 'system'
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional URL to redirect the user to when they click the notification
    }
  },
  { timestamps: true }
);

// Index for fast querying by user and sorting by date
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
