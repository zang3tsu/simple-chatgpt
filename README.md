# simple-chatgpt

This is a simple web application that allows users to input a prompt, stores it in a MongoDB database, and uses the OpenAI API to generate a response. The generated response is then displayed back to the user.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Setup

1. Clone the repository:

    ```
    git clone https://github.com/zang3tsu/simple-chatgpt.git
    ```

2. Change into the project directory:

    ```
    cd simple-chatgpt
    ```

3. Install the required dependencies:

    ```
    npm install
    ```

4. Create a `.env` file in the root of the project with the following environment variables:

    ```
    MONGODB_URI=mongodb://localhost:27017/simple-chatgpt
    OPENAI_API_KEY=your_openai_api_key
    SESSION_SECRET=your_session_secret
    ```

Replace `your_openai_api_key` with your actual OpenAI API key. Replace `your_session_secret` with a random string of characters (You can use `openssl rand -base64 32`).

5. Start the server:

    ```
    npm start
    ```
   
6. Open your browser and navigate to `http://localhost:3000` to use the application.