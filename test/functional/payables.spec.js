global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app").default;
const authService = require("../../src/services/auth-service.js");
const Sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Pagáveis", () => {
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

  it("Devemos conseguir consultar os pagamentos do usuário corrente", async () => {
    const response = await chai
      .request(app)
      .get("/payables")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (GET:/payables) - ${
      JSON.parse(response.text).message
      }`
    );

    assert.isArray(
      JSON.parse(response.text).data,
      "Estrutura de retorno inválida. DATA não retornou um array."
    );
  });

  it("Devemos conseguir consultar o relatório dos fundos do usuário corrente", async () => {
    const response = await chai
      .request(app)
      .get("/payables/funds?username=ROOT")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (GET:/payables/funds) - ${
      JSON.parse(response.text).message
      }`
    );

    const data = JSON.parse(response.text).data;
    assert.exists(
      data.avaible,
      "Estrutura de retorno inválida. AVAIBLE não foi encontrado."
    );
    assert.exists(
      data.waiting_funds,
      "Estrutura de retorno inválida. WAITING_FUNDS não foi encontrado."
    );
    assert.isNumber(
      data.avaible,
      "Estrutura de retorno inválida. AVAIBLE não é numérico."
    );
    assert.isNumber(
      data.waiting_funds,
      "Estrutura de retorno inválida. WAITING_FUNDS é numérico."
    );
  });

  it("Ao tentar antecipar um pagamento inexistente devemos receber uma mensagem de negação", async () => {
    const guid = uuidv4();
    const response = await chai
      .request(app)
      .post(`/payables/${guid}/antecipate`)
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      response.statusCode,
      401,
      `Não veio statusCode 200 (POST:/payables/${guid}/antecipate) - ${
      JSON.parse(response.text).message
      }`
    );

    const _message = JSON.parse(response.text).message;
    assert.equal(_message, `Não foi encontrado Pagável com guid \"${guid}\".`);
  });
});
