'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('permissions', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      after: 'name',
    });
    await queryInterface.addColumn('permissions', 'group', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'description',
    });
    await queryInterface.removeColumn('permissions', 'created_by');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('permissions', 'created_by', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      after: 'permission',
    });
    await queryInterface.removeColumn('permissions', 'description');
    await queryInterface.removeColumn('permissions', 'group');
  }
};
