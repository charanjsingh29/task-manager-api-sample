const Task = require('./task');
const TaskHasAttachments = require('./task_has_attachments');
const TaskHasComments = require('./task_has_comments');
const TaskHasUsers = require('./task_has_users');

const models = {
  Task,
  TaskHasAttachments,
  TaskHasComments,
  TaskHasUsers,
};

// Initialize all associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = models;