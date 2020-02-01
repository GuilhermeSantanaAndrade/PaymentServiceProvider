"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("ambients", [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "ROOT"
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ambients", null, {});
  }
};
