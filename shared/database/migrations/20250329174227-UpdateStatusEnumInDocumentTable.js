'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('documents', 'status', {
      type: Sequelize.ENUM('PENDING', 'IN-PROGRESS', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('documents', 'status', {
      type: Sequelize.ENUM('PENDING', 'COMPLETED'),
      defaultValue: 'PENDING'
    });
  }
};
