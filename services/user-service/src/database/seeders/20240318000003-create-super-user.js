'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create super user
    const superUser = {
      name: 'Super User',
      email: 'superuser@task.com',
      password: await bcrypt.hash('admin', 10),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert user and get the ID
    await queryInterface.bulkInsert('users', [superUser]);
    
    // Get the created user's ID
    const [[user]] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'superuser@docucenter.com'`
    );
    
    // Get role ID for Super-admin
    const [[superAdminRole]] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Super-admin'`
    );
    console.table({ user, superAdminRole });

    // Assign Super-admin role to super user
    await queryInterface.bulkInsert('user_has_roles', [{
      user_id: user.id,
      role_id: superAdminRole.id,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    // Remove in reverse order
    await queryInterface.bulkDelete('user_has_roles', null, {});
    await queryInterface.bulkDelete('users', {
      email: 'superuser@docucenter.com'
    }, {});
  }
};