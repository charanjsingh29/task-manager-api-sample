const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class DocumentAttachment extends Model {
  static associate(models) {
    DocumentAttachment.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document'
    });
    DocumentAttachment.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'uploader'
    });
  }
}

const DocumentAttachmentModel = DocumentAttachment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'DocumentAttachment',
  tableName: 'document_attachments',
  underscored: true,
  timestamps: false
});

module.exports = DocumentAttachmentModel;