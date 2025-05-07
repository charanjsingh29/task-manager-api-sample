'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const permissions = [
      { name: 'Create Document', permission: 'document:create', group: 'Documents' },
      { name: 'Read Document (All)', permission: 'document:read:all', group: 'Documents' },
      { name: 'Read Document (Own)', permission: 'document:read:own', group: 'Documents' },
      { name: 'Update Document', permission: 'document:update', group: 'Documents' },
      { name: 'Delete Document', permission: 'document:delete', group: 'Documents' },
      { name: 'Reopen Document', permission: 'document:reopen', group: 'Documents' },
      
      { name: 'Add Attachment', permission: 'document:attachment:add', group: 'Document Attachments' },
      { name: 'Delete Attachment (All)', permission: 'document:attachment:delete:all', group: 'Document Attachments' },
      { name: 'Delete Attachment (Own)', permission: 'document:attachment:delete:own', group: 'Document Attachments' },

      { name: 'Add Feedback', permission: 'document:feedback:add', group: 'Document Feedbacks' },
      { name: 'Read Feedbacks', permission: 'document:feedback:read', group: 'Document Feedbacks' },
      { name: 'Update Feedback', permission: 'document:feedback:update', group: 'Document Feedbacks' },
      { name: 'Delete Feedback', permission: 'document:feedback:delete', group: 'Document Feedbacks' },

      { name: 'Add User', permission: 'user:create', group: 'Users' },
      { name: 'Read Users', permission: 'user:read', group: 'Users' },
      { name: 'Update User', permission: 'user:update', group: 'Users' },
      { name: 'Delete User', permission: 'user:delete', group: 'Users' },

      { name: 'Add Role', permission: 'role:create', group: 'User Roles' },
      { name: 'Read Roles', permission: 'role:read', group: 'User Roles' },
      { name: 'Update Role', permission: 'role:update', group: 'User Roles' },
      { name: 'Delete Role', permission: 'role:delete', group: 'User Roles' },

      { name: 'Read Activity Logs (All)', permission: 'activity_log:read:all', group: 'Activity Log' },
      { name: 'Read Activity Logs (Own)', permission: 'activity_log:read:own', group: 'Activity Log' },

    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
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