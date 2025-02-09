const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Notification = require('../models/Notification')
const Invitation = require('../models/Invitation')

router.get('/', auth, async (req, res) => {
  try {
    const { category = 'all', page = 1, limit = 20 } = req.query
    const query = { userId: req.user._id, isArchived: false }

    if (category !== 'all') {
      query.category = category
    }

    const [notifications, pendingInvitations, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Invitation.find({ userId: req.user._id, status: 'pending' }),
      Notification.countDocuments({ userId: req.user._id, isRead: false }),
    ])

    res.json({
      notifications,
      pendingInvitations,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        hasMore: notifications.length === limit,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Mark notifications as read
router.post('/read', auth, async (req, res) => {
  try {
    const { notificationIds } = req.body
    const query = { userId: req.user._id }

    if (notificationIds?.length) {
      query._id = { $in: notificationIds }
    }

    await Notification.updateMany(query, { $set: { isRead: true } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Handle invitations
router.post('/invitations/:id/respond', auth, async (req, res) => {
  try {
    const { action } = req.body

    const invitation = await Invitation.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        status: 'pending',
      },
      { status: action === 'approve' ? 'approved' : 'rejected' },
      { new: true }
    )

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
