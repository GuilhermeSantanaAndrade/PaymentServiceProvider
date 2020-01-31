"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("payment_types", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      str_code: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      days_refund: {
        type: Sequelize.INTEGER,
        default: false
      },
      fee: {
        type: Sequelize.INTEGER,
        default: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("payment_types");
  }
};
