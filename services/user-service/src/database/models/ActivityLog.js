const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class ActivityLog extends Model {}

const ActivityLogModel = ActivityLog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  action_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'ActivityLog',
  tableName: 'activity_logs',
  underscored: true,
  timestamps: false,
});

module.exports = ActivityLogModel;