require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const notificationRoutes = require('./routes/notifications')
const settingsRoutes = require('./routes/settings')

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use('/notifications', notificationRoutes)
app.use('/settings', settingsRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on('SIGTERM', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
