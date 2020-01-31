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
      id_payable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "payables", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("paids");
  }
};
