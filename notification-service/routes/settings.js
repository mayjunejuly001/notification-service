const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

router.put('/notifications', auth, async (req, res) => {
  try {
    const { preferences } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationPreferences: preferences },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ preferences: user.notificationPreferences })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
