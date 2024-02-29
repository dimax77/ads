// database/connection.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'postgres',
  username: 'admin',
  password: 'password',
  database: 'data_base',
});

module.exports = { sequelize };
