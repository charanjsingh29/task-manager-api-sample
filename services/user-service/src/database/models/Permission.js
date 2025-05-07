const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Permission extends Model {
  static associate(models) {
    Permission.belongsToMany(models.Role, {
      through: 'role_has_permissions',
      as: 'roles',
      foreignKey: 'permission_id',
      otherKey: 'role_id'
    });
  }
}

const PermissionModel = Permission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'Permission',
  tableName: 'permissions',
  underscored: true,
  timestamps: true
});

module.exports = PermissionModel;