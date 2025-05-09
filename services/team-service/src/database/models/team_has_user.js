const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class TeamHasUser extends Model {
}

const TeamHasUsersModel = TeamHasUser.init({
  team_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    onDelete: 'CASCADE'
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    onDelete: 'CASCADE'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize: DefaultConnection,
  modelName: 'TeamHasUser',
  tableName: 'team_has_user',
  underscored: true,
  timestamps: false
});

module.exports = TeamHasUsersModel;