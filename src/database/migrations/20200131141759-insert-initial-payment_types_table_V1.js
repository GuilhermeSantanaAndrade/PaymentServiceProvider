"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("payment_types", [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "DEBITO",
        str_code: "debit_card",
        days_refund: 0,
        fee: 3
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "CREDITO",
        str_code: "credit_card",
        days_refund: 30,
        fee: 5
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("payment_types", null, {});
  }
};
