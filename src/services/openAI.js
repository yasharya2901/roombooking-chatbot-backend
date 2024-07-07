require('dotenv').config()
const client = require('openai')
const {getRoomDetails, postRoomDetails} = require('./bot9Ai');

const openai = new client({apiKey: process.env.OPEN_AI_API_KEY});

async function runConversation(content, conversationHistory) {
  // Step 1: send the conversation and available functions to the model
  const messages = [
    // { role: "user", content: content },
    { role: "system", content: "You are a room booking assistant. You can provide room details (name, price in rupees and description) and book rooms for users. Only ask for the room, user's full name, email, and the number of nights they want to stay. Do not ask for any other details. When the room is booked, always tell them the full information of booking response, especially the price. Always confirm with the details before booking. If user replies in other language, respond with the language provided by the user" },
    ...conversationHistory,
    { role: "user", content: content },

  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "getRoomDetails",
        description: "If the user asks for a room to stay or book, get them the room details with its name, description, and price, and ask user which one they want to book.",
      },
    },

    {
        type: "function",
        function: {
            name: "postRoomDetails",
            description: "Book the room for the user",
            parameters: {
                type: "object",
                properties: {
                    roomId: {
                        type: "number",
                        description: "The ID of the room to book.",
                    },
                    fullName: {
                        type: "string",
                        description: "The full name of the person booking the room",
                    },
                    email: {
                        type: "string",
                        description: "The email of the person booking the room",
                    },
                    nights: {
                        type: "number",
                        description: "The number of nights the person wants to book the room for",
                    },
                },
                required: ["roomId", "fullName", "email", "nights"],
            },
        },
        
    }
  ];


  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    tools: tools,
    tool_choice: "auto", // auto is default, but we'll be explicit
  });
  const responseMessage = response.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls;
  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions = {
        getRoomDetails: getRoomDetails,
        postRoomDetails: postRoomDetails,
    }; // only one function in this example, but you can have multiple
    messages.push(responseMessage); // extend conversation with assistant's reply
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      if (functionName === "postRoomDetails") {
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(
          functionArgs.roomId,
          functionArgs.fullName,
          functionArgs.email,
          functionArgs.nights
        );
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(functionResponse),
        }); // extend conversation with function response
      } else {
        const functionResponse = await functionToCall();
        messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: JSON.stringify(functionResponse),
        });
      }
    //   const functionArgs = JSON.parse(toolCall.function.arguments);
    }
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    }); // get a new response from the model where it can see the function response
    return secondResponse.choices[0].message.content;
  }
  else {
    return responseMessage.content;
  }
}


// runConversation(content).then(console.log).catch(console.error);


async function getResponseFromGPT(content, conversationHistory) {
    try {
        const response = await runConversation(content, conversationHistory);
        return response;
    } catch (error) {
        console.error(error);
    }
}

module.exports = getResponseFromGPT;