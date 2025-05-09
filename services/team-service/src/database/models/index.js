const Team = require('./Team');
const TeamHasUser = require('./TeamHasUser');

const models = {
  Team,
  TeamHasUser,
};

// Initialize all associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = models;