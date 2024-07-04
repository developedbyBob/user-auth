const express = require('express')
const connectDB = require('./config/db')
const app = express()
require('dotenv').config()

connectDB()
app.use(express.json())
app.use('/api/auth', require('./routes/authRoutes'))

module.exports = app