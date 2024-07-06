const {DataTypes} = require('sequelize');
const sequelize = require('../database/config');

const Conversation = sequelize.define('Conversation', {
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    response: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
})

module.exports = Conversation;