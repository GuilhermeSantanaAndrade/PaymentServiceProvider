global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app").default;
const authService = require("../../src/services/auth-service.js");
const Sequelize = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Usuarios", () => {
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

  after(async () => {
    global.dbConnection.close();
  });

  it("Devemos conseguir autenticar com o ROOT para obter um Token e permitir os demais testes", async () => {
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

    assert.equal(
      response.statusCode,
      200,
      "Não veio statusCode 200 (POST:/users/authenticate)"
    );

    const userAuthenticate = JSON.parse(response.text).data;

    const _token = userAuthenticate.token;
    const _username = userAuthenticate.username;

    assert.exists(_token, "'token' não foi retornado.");
    assert.exists(_username, "'username' não foi retornado.");

    assert.isNotEmpty(_token, "'token' foi retornado vazio.");
    assert.isNotEmpty(_token, "'username' foi retornado vazio.");
  });

  it("Devemos conseguir cadastrar um novo usuário e receber um status 200", async () => {
    const password = "AUTOTEST";
    const encripted_password = await authService.encodeToBase64(password);

    const body = {
      username: "AUTOTEST",
      key: encripted_password,
      ambient_name: "ROOT"
    };

    await global.dbConnection.query(
      `DELETE FROM "users" WHERE "username" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.DELETE }
    );

    const response = await chai
      .request(app)
      .post("/users")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      "Não veio statusCode 200 (POST:/users)"
    );

    const finds = await global.dbConnection.query(
      `SELECT * FROM "users" WHERE "username" = 'AUTOTEST';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(
      finds,
      "Após inclusão, não foi encontrado usuário no BD."
    );
  });

  it("Devemos autenticar com credenciais inválidas e o resultado deve ser status 401 e uma mensagem de não autorizado", async () => {
    const body = {
      username: "INVALIDO",
      key: "INVALIDO"
    };

    const response = await chai
      .request(app)
      .post("/users/authenticate")
      .send(body);

    assert.equal(
      response.statusCode,
      401,
      "Não veio statusCode 401 (POST:/users/authenticate)"
    );

    const userAuthenticate = JSON.parse(response.text);
    const _message = userAuthenticate.message;

    assert.equal(
      _message,
      "Usuário ou Senha inválidos.",
      "Não retornou a mensagem esperada"
    );
  });

  it("Devemos consultar clientes e receber um status 200", async () => {
    const response = await chai
      .request(app)
      .get("/users")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      response.statusCode,
      200,
      "Não veio statusCode 200 (GET:/users)"
    );
  });
});
