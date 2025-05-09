const Team = require('./team');
const TeamHasUser = require('./team_has_user');

const models = {
  Team,
  TeamHasUser,
};

// Initialize all associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = models;