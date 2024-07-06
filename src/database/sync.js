// src/database/sync.js
const sequelize = require('./config');

const sync = async () => {
  try {
    await sequelize.sync({ alter: true });  // This will drop the table if it already exists
    console.log('Database & tables synchronized!');
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

module.exports = sync;

