'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('task_has_users', {
      task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      assigned_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('task_has_users');
  }
};
