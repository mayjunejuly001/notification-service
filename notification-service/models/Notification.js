const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['follow', 'mention', 'chat', 'reply', 'contribution', 'reaction'],
    },
    category: {
      type: String,
      required: true,
      enum: ['all', 'contributions', 'reactions'],
      default: 'all',
    },
    actor: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      avatar: String,
    },
    target: {
      type: { type: String, required: true },
      id: { type: String, required: true },
      name: String,
    },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    index: { userId: 1, createdAt: -1 },
  }
)

module.exports = mongoose.model('Notification', notificationSchema)
