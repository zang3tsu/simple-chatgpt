document
    .getElementById('user-input-form')
    .addEventListener('submit', async (e) => {
        e.preventDefault()
        const userInputElement = document.getElementById('user-input')
        const prompt = userInputElement.value
        userInputElement.value = ''

        showResponseContainer()
        addPromptToContainer(prompt, true)

        try {
            const response = await fetch(window.location.href + 'api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            })

            const data = await response.json()

            // Store the session ID in local storage if it doesn't exist
            if (!localStorage.getItem('sessionId')) {
                localStorage.setItem('sessionId', data.sessionId)
            }

            // responseContainer.textContent = data.response

            await fetchAndDisplayPreviousPrompts()
        } catch (err) {
            console.error('Error getting openai response', err.message)
            showErrorMessage('Error getting OpenAI response')
        }
    })

function showErrorMessage(errMessage) {
    showResponseContainer()
    const responseContainer = document.getElementById('response-container')
    const errorRow = document.createElement('div')
    errorRow.classList.add(
        'row',
        'mx-5',
        'my-3',
        'p-3',
        'text-danger',
        'border',
        'border-danger',
        'rounded'
    )
    errorRow.textContent = errMessage
    responseContainer.appendChild(errorRow)
    errorRow.scrollIntoView({ behavior: 'smooth' })
}

function resetUserInput() {
    const userInputElement = document.getElementById('user-input')
    userInputElement.value = ''
}

function addPromptToContainer(prompt, loading = false) {
    const responseContainer = document.getElementById('response-container')

    const promptRowItem = document.createElement('div')
    promptRowItem.classList.add('row', 'me-5', 'ms-1')

    const promptColItem = document.createElement('div')
    promptColItem.classList.add(
        'col',
        'p-3',
        'm-2',
        'border',
        'border-primary',
        'rounded',
        'w-75'
    )
    promptRowItem.appendChild(promptColItem)
    promptColItem.textContent = prompt
    if (loading) {
        const spinner = document.createElement('div')
        spinner.classList.add('spinner-border', 'text-primary', 'my-auto')
        spinner.setAttribute('role', 'status')
        promptRowItem.appendChild(spinner)
    }
    responseContainer.appendChild(promptRowItem)
    promptRowItem.scrollIntoView({ behavior: 'smooth' })
}

function showResponseContainer() {
    const responseContainerDiv = document.getElementById(
        'response-container-div'
    )
    if (responseContainerDiv.classList.contains('h-90')) {
        return
    }
    responseContainerDiv.classList.add('h-90')
    const userInputDiv = document.getElementById('user-input-div')
    userInputDiv.classList.remove('h-100')
    userInputDiv.classList.add('h-10')
}

async function fetchAndDisplayPreviousPrompts() {
    try {
        // console.log('window.location.href:', window.location.href)
        const response = await fetch(window.location.href + 'api/prompts', {
            method: 'GET',
            credentials: 'include', // Include the session cookie with the request
        })

        const prompts = await response.json()
        const responseContainer = document.getElementById('response-container')

        responseContainer.innerHTML = ''

        if (prompts.length > 0) {
            showResponseContainer()
        }

        let lastResponseRowItem = null
        for (const prompt of prompts) {
            addPromptToContainer(prompt.prompt, false)

            const responseRowItem = document.createElement('div')
            responseRowItem.classList.add('row', 'ms-5', 'me-1')
            const responseColItem = document.createElement('div')
            responseColItem.classList.add(
                'col',
                'p-3',
                'm-2',
                'border',
                'border-secondary',
                'rounded',
                'w-75'
            )
            const preText = document.createElement('pre')
            preText.textContent = prompt.response
            responseColItem.appendChild(preText)
            responseRowItem.appendChild(responseColItem)
            responseContainer.appendChild(responseRowItem)
            lastResponseRowItem = responseRowItem
        }
        const userInputElement = document.getElementById('user-input')
        userInputElement.focus()
        if (lastResponseRowItem) {
            lastResponseRowItem.scrollIntoView({ behavior: 'smooth' })
        }
    } catch (err) {
        console.error('Failed to fetch previous prompts:', err)
        showErrorMessage('Failed to fetch previous prompts')
    }
}

resetUserInput()
fetchAndDisplayPreviousPrompts()
