const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()

const app = express()

connectDB()

app.use(express.json())

module.exports = app