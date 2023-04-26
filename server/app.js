const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const path = require('path')
require('dotenv').config()

const apiRoutes = require('./routes/api')
const MongoStore = require('connect-mongo')

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: MONGODB_URI }),
        cookie: { secure: false },
    })
)
app.use('/api', apiRoutes)
app.use(express.static(path.join(__dirname, '..', 'public')))

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
