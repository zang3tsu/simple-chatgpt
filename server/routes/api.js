const express = require('express')
const axios = require('axios')
const Prompt = require('../models/prompt')

const router = express.Router()

router.post('/prompts', async (req, res) => {
    const prompt = req.body.prompt
    const sessionId = req.session.id
    // console.log('post sessionId: ', sessionId)

    try {
        // console.log('prompt: ', prompt)

        const newPrompt = new Prompt({
            prompt: prompt,
            sessionId: sessionId,
        })
        // console.log('newPrompt: ', newPrompt)

        await newPrompt.save()
        // console.log('newPrompt saved')

        const openAIResponse = await getOpenAIResponse(prompt, sessionId)
        // console.log('openAIResponse: ', openAIResponse)

        newPrompt.response = openAIResponse
        await newPrompt.save()

        res.json({ response: openAIResponse })
    } catch (err) {
        console.log('err: ', err)
        res.status(500).json({ error: err.message })
    }
})

router.get('/prompts', async (req, res) => {
    const sessionId = req.session.id
    // console.log('get sessionId: ', sessionId)

    try {
        const prompts = await Prompt.find({ sessionId: sessionId }).sort({
            createdAt: 1,
        })
        res.json(prompts)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})

async function getOpenAIResponse(prompt, sessionId) {
    const openAIUrl = 'https://api.openai.com/v1/chat/completions'
    const apiKey = process.env.OPENAI_API_KEY

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
    }

    const data = {
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
        user: sessionId,
    }

    try {
        // console.log('openAIUrl: ', openAIUrl)
        // console.log('data: ', data)
        // console.log('headers: ', headers)
        const response = await axios.post(openAIUrl, data, { headers: headers })
        // console.log('response:', response)
        return response.data.choices[0].message.content.trim()
    } catch (err) {
        console.log(err)
        throw new Error('Failed to fetch response from OpenAI API')
    }
}

module.exports = router
