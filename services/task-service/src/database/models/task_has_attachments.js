const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class TaskHasAttachments extends Model {
  static associate(models) {
    TaskHasAttachments.belongsTo(models.Task, {
      foreignKey: 'task_id',
      as: 'task'
    });
  }
}

const TaskHasAttachmentsModel = TaskHasAttachments.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  filename : {
    type: DataTypes.TEXT,
    allowNull: false
  },
  original_name : {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'TaskHasAttachments',
  tableName: 'task_has_attachments',
  underscored: true,
  timestamps: true
});

module.exports = TaskHasAttachmentsModel;