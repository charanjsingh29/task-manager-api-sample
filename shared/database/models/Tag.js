const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Tag extends Model {
  static associate(models) {
    Tag.belongsToMany(models.Document, {
      through: 'document_has_tags',
      as: 'documents',
      foreignKey: 'tag_id',
      otherKey: 'document_id',
      timestamps: false
    });
    Tag.belongsToMany(models.User, {
      through: 'user_has_tags',
      as: 'users',
      foreignKey: 'tag_id',
      otherKey: 'user_id',
      timestamps: false
    })
  }
}

const TagModel = Tag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'Tag',
  tableName: 'tags',
  underscored: true,
  timestamps: false // Since we're only using created_at
});

module.exports = TagModel;