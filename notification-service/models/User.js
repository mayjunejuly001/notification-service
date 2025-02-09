const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    notificationPreferences: {
      appNotifications: {
        mentions: { type: Boolean, default: true },
        follows: { type: Boolean, default: true },
        chats: { type: Boolean, default: true },
        replies: { type: Boolean, default: true },
      },
      emailNotifications: {
        emailAlerts: { type: Boolean, default: true },
        newMessages: { type: Boolean, default: true },
      },
      chatNotifications: {
        showOnlineStatus: { type: Boolean, default: true },
        notificationSound: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
