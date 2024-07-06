const Conversation = require('../models/conversation');
const sequelize = require('./config');

// Create a new conversation
const createConversation = async (data) => {
  try {
    await sequelize.authenticate();
    const conversation = await Conversation.create(data);
    return conversation;
  } catch (error) {
    throw error;
  }
};

module.exports = createConversation;