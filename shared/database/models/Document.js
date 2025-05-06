const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Document extends Model {
  static associate(models) {
    Document.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Document.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignee',
    });
    Document.hasMany(models.DocumentAttachment, {
      foreignKey: 'document_id',
      as: 'attachments'
    });
    // Add this new association
    Document.belongsToMany(models.Tag, {
      through: 'document_has_tags',
      as: 'tags',
      foreignKey: 'document_id',
      otherKey: 'tag_id',
      timestamps: false
    });
    Document.hasMany(models.Feedback, {
      foreignKey: 'document_id',
      as: 'feedbacks'
    });
  }
}

const DocumentModel = Document.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
    defaultValue: 'MEDIUM'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  overdue_sent_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'Document',
  tableName: 'documents',
  underscored: true,
  timestamps: true
});

module.exports = DocumentModel;