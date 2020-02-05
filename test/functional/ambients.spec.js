global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app").default;
const authService = require("../../src/services/auth-service.js");
const Sequelize = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Ambientes", () => {
  before(async () => {
    // GET ACCESS-TOKEN FOR ALL TESTs
    const password = "ROOT";
    const encripted_password = await authService.encodeToBase64(password);

    const body = {
      username: "ROOT",
      key: encripted_password
    };

    const response = await chai
      .request(app)
      .post("/users/authenticate")
      .send(body);

    const _token = JSON.parse(response.text).data.token;
    global.AUTOTEST_ACCESS_TOKEN = _token;
  });

  it("Devemos conseguir cadastrar um novo ambiente e receber um status 200", async () => {
    const body = {
      name: "AUTOTEST",
      antecipate_fee: 2
    };

    await global.dbConnection.query(
      `DELETE FROM "ambients" WHERE "name" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.DELETE }
    );

    const response = await chai
      .request(app)
      .post("/ambients")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (POST:/ambients) - ${
      JSON.parse(response.text).message
      }`
    );

    const finds = await global.dbConnection.query(
      `SELECT * FROM "ambients" WHERE "name" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(
      finds,
      "Após inclusão, não foi encontrado ambiente no BD."
    );
  });

  it("Devemos conseguir consultar o ambiente cadastrado no teste anterior", async () => {
    try {
      const finds = await global.dbConnection.query(
        `SELECT "id" FROM "ambients" WHERE "name" = 'AUTOTEST';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      assert.isNotEmpty(finds, "Não foi encontrado ambiente 'AUTOTEST'.");

      const response = await chai
        .request(app)
        .get(`/ambients/${finds[0].id}`)
        .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

      assert.equal(
        response.statusCode,
        200,
        `Não veio statusCode 200 (POST:/ambients) - ${
        JSON.parse(response.text).message
        }`
      );

      assert.isNotEmpty(
        JSON.parse(response.text).data,
        "Não foi retornado ambiente após GET."
      );
    } catch (err) {
      assert.fail(err);
    }
  });
});
