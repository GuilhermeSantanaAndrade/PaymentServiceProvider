"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ambients", {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      antecipate_fee: {
        type: Sequelize.DOUBLE,
        default: 1
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ambients");
  }
};
