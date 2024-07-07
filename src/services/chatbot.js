const getResponseFromAI = require('./openAI');
const createConversation = require('../database/createConversation');
const getResponseFromGPT = require('./openAI')
const getConversationHistory = require('./getConversationHistory');

const chat = async (req, res) => {
    try {
        const request = req.body;
        console.log(request)
        // data to be saved by database
        const sessionId = request.sessionId;
        const userId = request.userId;
        const message = request.message;
        
        
        // get conversation history
        let conversationHistory = await getConversationHistory(sessionId);
        console.log(conversationHistory);
        const response = await getResponseFromGPT(request.message, conversationHistory);
        const responseFromAI = response;
        

        // save the user conversation in the database
        createConversation({sessionId, userId, message: message, role: "user"})
            .then(() => console.log('User Conversation saved'))
            .catch((error) => console.error('Error saving conversation:', error));
        
        // save the AI response in the database
        createConversation({sessionId, userId, message: responseFromAI, role: "assistant"})
            .then(() => console.log('AI Conversation saved'))
            .catch((error) => console.error('Error saving conversation:', error));

        res.json({response : response});
    } catch (error) {
        res.json({response: "Sorry, I am not able to respond at the moment. Please try again later."})
    }
}

module.exports = chat;