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
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Protect against CSRF attacks
            httpOnly: true, // Prevent client-side access to the cookie
        },
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

const csp = require('helmet-csp')
app.use(
    csp({
        directives: {
            defaultSrc: [
                "'self'",
                'https://xkpxfvtqo9.execute-api.us-east-1.amazonaws.com',
            ],
            // Add other directives as needed, e.g., imgSrc, scriptSrc, styleSrc, etc.
        },
    })
)

// serverless
const serverless = require('serverless-http')
module.exports.handler = serverless(app)
