const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class TaskHasComments extends Model {
  static associate(models) {
    TaskHasComments.belongsTo(models.Task, {
      foreignKey: 'task_id',
      as: 'task'
    });
  }
}

const TaskHasCommentsModel = TaskHasComments.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment  : {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'TaskHasComments',
  tableName: 'task_has_comments',
  underscored: true,
  timestamps: true
});

module.exports = TaskHasCommentsModel;