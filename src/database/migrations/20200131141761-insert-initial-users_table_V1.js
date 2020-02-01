"use strict";
const md5 = require("md5");
require("../../globals.js");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Associa usuário ROOT ao ambiente ROOT
      const find = await queryInterface.sequelize.query(
        "SELECT * FROM ambients AS Ambient where Ambient.name = 'ROOT'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (!find.length) {
        throw "Ambient ROOT não foi encontrado.";
      }

      const password = md5("ROOT" + global.SALT_KEY);

      return queryInterface.bulkInsert("users", [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          id_ambient: find[0].id || undefined,
          username: "ROOT",
          encrypted_psw: password,
          user_admin: true
        }
      ]);
    } catch (err) {
      throw err;
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
