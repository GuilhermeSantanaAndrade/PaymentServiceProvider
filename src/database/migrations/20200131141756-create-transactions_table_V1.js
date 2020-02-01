"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transactions", {
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
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      external_sale_id: {
        type: Sequelize.STRING(30),
        default: false
      },
      value: {
        type: Sequelize.DOUBLE,
        default: false
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      id_payment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "payment_types", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      sufix_card_number: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      dueDate_card: {
        //MM/YY
        type: Sequelize.STRING(5),
        allowNull: false
      },
      cvv_card: {
        type: Sequelize.STRING(3),
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transactions");
  }
};
