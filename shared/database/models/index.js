const ActivityLog = require('./ActivityLog');
const Document = require('./Document');
const DocumentAttachment = require('./DocumentAttachment');
const Feedback = require('./Feedback');
const Notification = require('./Notification');
const Permission = require('./Permission');
const Role = require('./Role');
const Tag = require('./Tag');
const User = require('./User');
const UserHasNotification = require('./UserHasNotification');



const models = {
  ActivityLog,
  Document,
  DocumentAttachment,
  Feedback,
  Notification,
  Permission,
  Role,
  Tag,
  User,
  UserHasNotification,
};

// Initialize all associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = models;