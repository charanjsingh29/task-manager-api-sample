'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('document_has_tags', {
      document_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'documents',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  // This is fine as we want to remove tag associations when document is deleted
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'  // Changed to RESTRICT to prevent tag deletion if it has associations
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('document_has_tags');
  }
};
