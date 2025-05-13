const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Notification extends Model {
  static associate(models) {
    Notification.hasMany(models.UserHasNotifications, {
      foreignKey: 'task_id',
      as: 'users'
    });
  }
}

const NotificationModel = Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  related_to : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  relation_id : {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'Notification',
  tableName: 'notifications',
  underscored: true,
  timestamps: false
});

module.exports = NotificationModel;