# Room Booking Chatbot
This is a chatbot that allows users to book rooms in a hotel. The chatbot is built using ExpressJS and ChatGPT. The chatbot can provide information about the hotel and the rooms available. It also allows users to book rooms based on their preferences.

## Features
- Provides information about the hotel
- Performs room booking

## How to Use
To use the chatbot, follow these steps:
1. Clone the repository
    ```shell
    git clone https://github.com/yasharya2901/roombooking-chatbot-backend.git
    ```
2. Install the dependencies
    ```shell
    npm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables as provided in the `.env.example` file:
    ```shell
    PORT={YOUR_DESIRED_PORT}
    OPEN_AI_API_KEY={YOUR_OPEN_AI_API_KEY}
    URL_LINK={LINK_FOR_BOT9AI_SERVICE}
    ```
    You can get the ChatGPT API key by signing up on the [OpenAI website](https://platform.openai.com/).
4. Start the server
    ```shell
    npm start
    ```
5. Open the chatbot frontend
    Link to the frontend: [Room Booking Chatbot Frontend](https://github.com/yasharya2901/roombooking-chatbot-frontend)

6. Start chatting with the chatbot

## API Endpoints
- `/chat`: This endpoint is used to send messages to the chatbot and get responses.
    It is a POST request that accepts the following parameters:
    - `sessionId`: The session ID of the client
    - `userId`: The user ID of the user
    - `message`: The message sent by the user

## Example
```shell
curl -X POST http://localhost:3000/chat \
-H "Content-Type: application/json" \
-d '{
    "sessionId": "7596ee73-1a8e-4a9d-bcef-c08c3531ccb2",
    "userId": "JohnDoe",
    "message": "I want to book a room"
}'
```

# Workflow

1. **Request Reception**: The client initiates a request to the server.
2. **Service Invocation**: The request is passed to the `chat()` function located in the `services/chatbot.js` file.
3. **Retrieve Conversation History**: The `chat()` function retrieves the user's conversation history from the database using the provided `sessionId`.
4. **Send Message to ChatGPT API**: The `chat()` function forwards the user's message to the ChatGPT API and obtains a response.
5. **Update Conversation History**: The `chat()` function updates the user's conversation history with the new message and the received response.
6. **Send Response to Client**: The response from the ChatGPT API is returned to the client.
