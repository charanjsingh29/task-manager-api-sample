const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Feedback extends Model {
  static associate(models) {
    Feedback.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document'
    });
    Feedback.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'creator'
    });
  }
}

const FeedbackModel = Feedback.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'documents',
      as: 'document',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      as: 'creator',
      key: 'id'
    }
  },
  feedback_text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'Feedback',
  tableName: 'feedbacks',
  underscored: true,
  timestamps: true
});

module.exports = FeedbackModel;