const { Model, DataTypes } = require('sequelize');
const DefaultConnection = require('../config/connection');

class Team extends Model {
}

const TeamModel = Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize: DefaultConnection,
  modelName: 'Team',
  tableName: 'teams',
  underscored: true,
  timestamps: true
});

module.exports = TeamModel;