const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Notification extends Model {}

const NotificationModel = Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
},{
    sequelize: DefaultConnection,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,
    timestamps: false
});

module.exports = NotificationModel;