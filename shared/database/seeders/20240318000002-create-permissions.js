'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const permissions = [
      { name: 'Create Document', permission: 'document:create', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Document (All)', permission: 'document:read:all', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Document (Own)', permission: 'document:read:own', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      { name: 'Update Document', permission: 'document:update', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete Document', permission: 'document:delete', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      { name: 'Reopen Document', permission: 'document:reopen', group: 'Documents', created_at: new Date(), updated_at: new Date() },
      
      { name: 'Add Attachment', permission: 'document:attachment:add', group: 'Document Attachments', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete Attachment (All)', permission: 'document:attachment:delete:all', group: 'Document Attachments', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete Attachment (Own)', permission: 'document:attachment:delete:own', group: 'Document Attachments', created_at: new Date(), updated_at: new Date() },

      { name: 'Add Feedback', permission: 'document:feedback:add', group: 'Document Feedbacks', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Feedbacks', permission: 'document:feedback:read', group: 'Document Feedbacks', created_at: new Date(), updated_at: new Date() },
      { name: 'Update Feedback', permission: 'document:feedback:update', group: 'Document Feedbacks', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete Feedback', permission: 'document:feedback:delete', group: 'Document Feedbacks', created_at: new Date(), updated_at: new Date() },

      { name: 'Add User', permission: 'user:create', group: 'Users', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Users', permission: 'user:read', group: 'Users', created_at: new Date(), updated_at: new Date() },
      { name: 'Update User', permission: 'user:update', group: 'Users', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete User', permission: 'user:delete', group: 'Users', created_at: new Date(), updated_at: new Date() },

      { name: 'Add Role', permission: 'role:create', group: 'User Roles', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Roles', permission: 'role:read', group: 'User Roles', created_at: new Date(), updated_at: new Date() },
      { name: 'Update Role', permission: 'role:update', group: 'User Roles', created_at: new Date(), updated_at: new Date() },
      { name: 'Delete Role', permission: 'role:delete', group: 'User Roles', created_at: new Date(), updated_at: new Date() },

      { name: 'Read Activity Logs (All)', permission: 'activity_log:read:all', group: 'Activity Log', created_at: new Date(), updated_at: new Date() },
      { name: 'Read Activity Logs (Own)', permission: 'activity_log:read:own', group: 'Activity Log', created_at: new Date(), updated_at: new Date() },

    ];

    await queryInterface.bulkInsert('permissions', permissions, {});

    // Assign all permissions to Super-admin role
    /* const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM permissions`
    );

    const rolePermissions = permissions.map(permission => ({
      role_id: superAdminRole[0].id,
      permission_id: permission.id,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('role_has_permissions', rolePermissions, {}); */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_has_permissions', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
    await queryInterface.bulkDelete('permissions', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true
    });
  }
};