const express = require('express')
const axios = require('axios')
const Prompt = require('../models/prompt')

const router = express.Router()

router.post('/submit-prompt', async (req, res) => {
    const prompt = req.body.prompt
    const sessionId = req.session.id

    try {
        console.log('prompt: ', prompt)

        const newPrompt = new Prompt({
            prompt: prompt,
            sessionId: sessionId,
        })
        // console.log('newPrompt: ', newPrompt)

        await newPrompt.save()
        // console.log('newPrompt saved')

        const openAIResponse = await getOpenAIResponse(prompt)
        console.log('openAIResponse: ', openAIResponse)

        newPrompt.response = openAIResponse
        await newPrompt.save()

        res.json({ response: openAIResponse })
    } catch (err) {
        console.log('err: ', err)
        res.status(500).json({ error: err.message })
    }
})

async function getOpenAIResponse(prompt) {
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
        max_tokens: 100,
    }

    try {
        // console.log('openAIUrl: ', openAIUrl)
        // console.log('data: ', data)
        // console.log('headers: ', headers)
        const response = await axios.post(openAIUrl, data, { headers: headers })
        // console.log('response:', response)
        return response.data.choices[0].message.content.trim()
    } catch (err) {
        throw new Error('Failed to fetch response from OpenAI API')
    }
}

module.exports = router
