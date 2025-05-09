const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Task extends Model {
  static associate(models) {
    Task.hasMany(models.TaskHasUsers, {
      foreignKey: 'task_id',
      as: 'users'
    });
    Task.hasMany(models.TaskHasAttachments, {
      foreignKey: 'task_id',
      as: 'attachments'
    });
    Task.hasMany(models.TaskHasComments, {
      foreignKey: 'task_id',
      as: 'comments'
    });
  }
}

const TaskModel = Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  due_date : {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'OPEN'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'Task',
  tableName: 'tasks',
  underscored: true,
  timestamps: true
});

module.exports = TaskModel;