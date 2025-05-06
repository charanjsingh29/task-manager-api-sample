const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class UserHasNotification extends Model {
    static associate(models) {
      this.belongsTo(models.Notification, { 
        foreignKey: 'notification_id',
        as: 'notification',
      });
    }
}

const UserHasNotificationModel = UserHasNotification.init({
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notification_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }

},{
    sequelize: DefaultConnection,
    modelName: 'UserHasNotification',
    tableName: 'user_has_notifications',
    timestamps: false,
    underscored: true
})

module.exports = UserHasNotificationModel;