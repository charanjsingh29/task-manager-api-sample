const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Role extends Model {
  static associate(models) {
    // Define all associations here
    Role.belongsToMany(models.Permission, {
      through: 'role_has_permissions',
      as: 'permissions',
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      timestamps: true,
      underscored: true
    });

    Role.belongsToMany(models.User, {
      through: 'user_has_roles',
      as: 'users',
      foreignKey: 'role_id',
      otherKey: 'user_id',
      timestamps: true,
      underscored: true
    });

    Role.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  }
}

const RoleModel = Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  is_hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'Role',
  tableName: 'roles',
  underscored: true,
  timestamps: true
});

module.exports = RoleModel;