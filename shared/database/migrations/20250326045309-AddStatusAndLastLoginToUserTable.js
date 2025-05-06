'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      after: 'phone',
      comment: '1: Active, 0: Inactive'
    });

    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after: 'status',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'last_login');
  }
};
