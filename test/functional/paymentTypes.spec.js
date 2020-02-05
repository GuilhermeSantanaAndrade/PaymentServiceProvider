global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app").default;
const authService = require("../../src/services/auth-service.js");
const Sequelize = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Tipos de Pagamento", () => {
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

  it("Devemos conseguir cadastrar um novo tipo de pagamento e receber um status 200", async () => {
    const body = {
      description: "AUTOTEST",
      str_code: "auto_test",
      days_refund: 50,
      fee: 4.5
    };

    await global.dbConnection.query(
      `DELETE FROM "payment_types" WHERE "description" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.DELETE }
    );

    const response = await chai
      .request(app)
      .post("/payment_types")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (POST:/payment_types) - ${
        JSON.parse(response.text).message
      }`
    );

    const finds = await global.dbConnection.query(
      `SELECT * FROM "payment_types" WHERE "description" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(
      finds,
      "Após inclusão, não foi encontrado payment_type no BD."
    );
  });

  it("Devemos conseguir consultar o tipo de pagamento cadastrado no teste anterior", async () => {
    try {
      const finds = await global.dbConnection.query(
        `SELECT "id" FROM "payment_types" WHERE "description" = 'AUTOTEST';`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      assert.isNotEmpty(
        finds,
        "Não foi encontrado tipo de pagamento 'AUTOTEST'."
      );

      const response = await chai
        .request(app)
        .get(`/payment_types/${finds[0].id}`)
        .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

      assert.equal(
        response.statusCode,
        200,
        `Não veio statusCode 200 (POST:/payment_types) - ${
          JSON.parse(response.text).message
        }`
      );

      assert.isNotEmpty(
        JSON.parse(response.text).data,
        "Não foi retornado tipo de pagamento após GET."
      );
    } catch (err) {
      assert.fail(err);
    }
  });
});
