"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("ambients", [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "PAGAR.ME"
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ambients", null, {});
  }
};
