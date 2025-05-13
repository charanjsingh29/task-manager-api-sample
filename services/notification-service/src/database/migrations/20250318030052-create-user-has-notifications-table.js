'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_has_notifications', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      notification_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_has_notifications');
  }
};
