'use strict';

const {DATEONLY} = require("sequelize/lib/data-types");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('documents', 'deadline', {
      type: Sequelize.DATEONLY,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('documents', 'deadline', {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
};
