require('dotenv').config()
const openAI = require('openai')

const client = new openAI({apiKey: process.env.OPEN_AI_API_KEY})

async function getResponseFromAI(content) {
    try {
      const completion = await client.chat.completions.create({
        messages: [{ role: "user", content: content }],
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  }

module.exports = getResponseFromAI;