"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("payables", {
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
      id_transaction: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "transactions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      date_to_refund_transaction: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(10),
        default: false
      },
      gross_value: {
        type: Sequelize.DOUBLE,
        default: false
      },
      fee_percent: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fee_value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      net_value: {
        type: Sequelize.DOUBLE,
        default: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("payables");
  }
};
