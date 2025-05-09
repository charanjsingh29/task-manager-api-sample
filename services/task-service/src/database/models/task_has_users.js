const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class TaskHasUsers extends Model {
  static associate(models) {
    TaskHasUsers.belongsTo(models.Task, {
      foreignKey: 'task_id',
      as: 'task'
    });
  }
}

const TaskHasUsersModel = TaskHasUsers.init({
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'TaskHasUsers',
  tableName: 'task_has_users',
  underscored: true,
  timestamps: true
});

module.exports = TaskHasUsersModel;