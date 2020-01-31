"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_ambient: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "ambients", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      username: {
        type: Sequelize.STRING(25),
        allowNull: false
      },
      encrypted_psw: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      user_admin: {
        type: Sequelize.BOOLEAN,
        default: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
