const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class UserHasNotifications extends Model {
  static associate(models) {
    UserHasNotifications.belongsTo(models.Notification, { 
      foreignKey: 'notification_id',
      as: 'notification',
    });
  }
}

const UserHasNotificationsModel = UserHasNotifications.init({
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  is_seen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'UserHasNotifications',
  tableName: 'user_has_notifications',
  underscored: true,
  timestamps: false
});

module.exports = UserHasNotificationsModel;