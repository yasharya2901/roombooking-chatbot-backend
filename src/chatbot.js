const getResponseFromAI = require('./openAI');
const createConversation = require('./database/createConversation');

const chat = async (req, res) => {
    try {
        const request = req.body;
        console.log(request)
        const response = await getResponseFromAI(request.message);

        // data to be saved by database
        const sessionId = request.sessionId;
        const userId = request.userId;
        const message = request.message;
        const responseFromAI = response;

        // save the conversation in the database
        createConversation({sessionId, userId, message, response: responseFromAI})
            .then(() => console.log('Conversation saved'))
            .catch((error) => console.error('Error saving conversation:', error));

        res.json({response : response});
    } catch (error) {
        res.json({response: "Sorry, I am not able to respond at the moment. Please try again later."})
    }
}

module.exports = chat;