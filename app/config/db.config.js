const Sequelize = require('sequelize');
const sequelize = new Sequelize('readapp', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  logging: false, // tắt log
});

module.exports = sequelize;