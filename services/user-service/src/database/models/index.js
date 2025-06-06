const Permission = require('./Permission');
const Role = require('./Role');
const User = require('./User');

const models = {
  Permission,
  Role,
  User,
};

// Initialize all associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = models;