const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const DefaultConnection = require('../config/connection');

class User extends Model {
  static associate(models) {
    User.belongsToMany(models.Role, {
      through: 'user_has_roles',
      as: 'roles',
      foreignKey: 'user_id',
      otherKey: 'role_id',
      timestamps: true,
      underscored: true
    });

    User.belongsToMany(models.Tag, {
      through: 'user_has_tags',
      as: 'tags',
      foreignKey: 'user_id',
      otherKey: 'tag_id',
      timestamps: false
    })
    
    // Add any other User associations here
    User.hasMany(models.Document, {
      foreignKey: 'created_by',
      as: 'createdDocuments'
    });
    
    User.hasMany(models.Document, {
      foreignKey: 'assigned_to',
      as: 'assignedDocuments'
    });
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

const UserModel = User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    comment: '1: Active, 0: Inactive'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      console.log(user.password);
      console.log(user.changed('password'));
      if (user.password.trim() != "" && user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = UserModel;