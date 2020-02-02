"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("paids", {
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
      guid: {
        type: Sequelize.STRING(60),
        default: false,
        allowNull: false
      },
      id_payable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "payables", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      paid_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      paidValue: {
        type: Sequelize.DOUBLE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("paids");
  }
};
