const mongoose = require('mongoose')

const promptSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    },
    response: {
        type: String,
    },
    sessionId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Prompt', promptSchema)
