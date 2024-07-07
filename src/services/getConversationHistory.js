const { getConversationBySessionId } = require('../database/getConversation');

async function getConversationHistory(sessionId) {
    // Get conversation by sessionId
    const conversations = await getConversationBySessionId(sessionId);
    let conversationsArray = Array.isArray(conversations) ? conversations : [];

    conversationsArray = conversationsArray.map((conversation) => {
        {   
            return {
                role: conversation.dataValues.role,
                content: (conversation.dataValues.message) ? conversation.dataValues.message : ""
            }
        }
    })

    return conversationsArray;
}

module.exports = getConversationHistory;
