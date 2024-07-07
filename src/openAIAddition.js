require('dotenv').config()
const client = require('openai')
const {getRoomDetails, postRoomDetails} = require('./bot9Ai');

const openai = new client({apiKey: process.env.OPEN_AI_API_KEY});

async function runConversation(content, conversationHistory) {
  // Step 1: send the conversation and available functions to the model
  const messages = [
    // { role: "user", content: content },
    ...conversationHistory,
    { role: "user", content: content },

  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "getRoomDetails",
        description: "If the user asks for a room to stay or book, get the array of room details with its name, description, and price, and ask user which one they want to book",
      },
    },

    {
        type: "function",
        function: {
            name: "postRoomDetails",
            description: "If the user shows interest in booking the rooms, ask for the which room they want to book. They will tell you room either by the name of the room, or the order it was in (for e.g. first, second or third), or by price. Infer the room id by those details. If the user is mentioning first, take the room id argument as 1 and so on. and, then proceed with asking for the full name, email, and number of nights they want to book the room for. And, ask the user if they are sure to confirm the booking and then call this function. And return the response of the booking with the booking id and the details of the booking and total price.",
            parameters: {
                type: "object",
                properties: {
                    roomId: {
                        type: "string",
                        description: "The room id of the room to be booked",
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
    model: "gpt-3.5-turbo",
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
      model: "gpt-3.5-turbo",
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