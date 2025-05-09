const { Sequelize } = require('sequelize');
const config = require('./config');

const DefaultConnection = new Sequelize(
  config.default.database,
  config.default.username,
  config.default.password,
  {
    host: config.default.host,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = DefaultConnection;