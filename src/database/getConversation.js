const Conversation = require('../models/conversation');
const sequelize = require('./config');

// Get all conversations
const getConversations = async () => {
    try {
        await sequelize.authenticate();
        const conversations = await Conversation.findAll();
        return conversations;
    } catch (error) {
        throw error;
    }
}

// Get conversation by sessionId
const getConversationBySessionId = async (sessionId) => {
    try {
        await sequelize.authenticate();
        const conversation = await Conversation.findAll({ where: { sessionId: sessionId } });
        return conversation;
    } catch (error) {
        throw error;
    }
}

module.exports = { getConversations, getConversationBySessionId };