'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'provider', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'local'
    });

    await queryInterface.addColumn('users', 'provider_id', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'provider');
    await queryInterface.removeColumn('users', 'provider_id');
  }
};
