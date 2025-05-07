'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      { 
        name: 'Super-admin', 
        is_hidden: true, 
        is_default: true,
        created_at: new Date(), 
        updated_at: new Date() 
      },
      { 
        name: 'User', 
        is_hidden: false, 
        is_default: true,
        created_at: new Date(), 
        updated_at: new Date() 
      },
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
  }
};