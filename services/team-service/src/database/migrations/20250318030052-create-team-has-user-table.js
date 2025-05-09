'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team_has_user', {
      team_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('team_has_user');
  }
};