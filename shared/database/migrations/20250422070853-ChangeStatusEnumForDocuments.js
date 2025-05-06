'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn('documents', 'status', {
      type: Sequelize.ENUM('PENDING', 'IN-PROGRESS', 'RESOLVED', 'CANCELLED'),
      defaultValue: 'PENDING',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('documents', 'status', {
      type: Sequelize.ENUM('PENDING', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING',
      allowNull: false
    });
  }
};
