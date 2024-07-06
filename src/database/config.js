const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'convo_db.sqlite'
});


module.exports = sequelize;