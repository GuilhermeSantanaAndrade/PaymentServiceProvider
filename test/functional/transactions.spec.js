global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../src/app").default;
const authService = require("../../src/services/auth-service.js");
const Sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const randomer = require("../../src/utils/functions.js");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Transações", () => {
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

  it("Devemos conseguir incluir transações como débito e o payable deve retornar paid", async () => {
    const finds = await global.dbConnection.query(
      `SELECT "id" FROM "users" WHERE "username" = 'ROOT';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(finds, "Não foi encontrado ambiente 'ROOT'.");

    const id_user = finds[0].id;
    const service_id = randomer.minMaxRandom(100, 999999).pad(10);
    const sale_id = randomer.minMaxRandom(100, 99999);
    const cardNumber = "9999999999999999";
    const ownerNameCard = "AUTO T EST";
    const dueDateCard = "01/25";
    const cvvCard = "159";

    const body = {
      service_id: service_id,
      id_user: id_user,
      external_sale_id: `SALE-${sale_id}`,
      value: 99.99,
      description: "Transação gerada pelo AutoTeste",
      str_code_payment: "debit_card",
      card_number: await authService.encodeToBase64(cardNumber),
      owner_name_card: await authService.encodeToBase64(ownerNameCard),
      dueDate_card: await authService.encodeToBase64(dueDateCard),
      cvv_card: await authService.encodeToBase64(cvvCard)
    };

    const response = await chai
      .request(app)
      .post("/transactions")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (POST:/transactions) - ${
        JSON.parse(response.text).message
      }`
    );

    const data = JSON.parse(response.text).data;

    assert.exists(
      data.nsu,
      "Estrutura de retorno inválida. NSU não foi encontrado."
    );
    assert.exists(
      data.aut,
      "Estrutura de retorno inválida. AUT não foi encontrado."
    );
    assert.exists(
      data.transactionGuid,
      "Estrutura de retorno inválida. TRANSACTIONGUID não foi encontrado."
    );
    assert.exists(
      data.payableGuid,
      "Estrutura de retorno inválida. PAYABLEGUID não foi encontrado."
    );
    assert.exists(
      data.date_to_refund_transaction,
      "Estrutura de retorno inválida. DATE_TO_REFUND_TRANSACTION não foi encontrado."
    );
    assert.exists(
      data.status_refund,
      "Estrutura de retorno inválida. STATUS_REFUND não foi encontrado."
    );
    assert.equal(data.status_refund, global.PAID);
    assert.exists(
      data.fee_percent,
      "Estrutura de retorno inválida. FEE_PERCENT não foi encontrado."
    );
    assert.exists(
      data.fee_value,
      "Estrutura de retorno inválida. FEE_VALUE não foi encontrado."
    );
  });

  it("Devemos conseguir consultar as transações filtrando usuário", async () => {
    const response = await chai
      .request(app)
      .get("/transactions?username=ROOT")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (GET:/transactions) - ${
        JSON.parse(response.text).message
      }`
    );

    const data = JSON.parse(response.text).data;

    assert.isArray(data, "Data não retornou um array.");
    assert.isNotEmpty(data, "Data foi retornado sem registros.");
    assert.exists(
      data[0].id,
      "Estrutura de retorno inválida. ID não foi encontrado."
    );
    assert.exists(
      data[0].guid,
      "Estrutura de retorno inválida. GUID não foi encontrado."
    );
    assert.exists(
      data[0].service_id,
      "Estrutura de retorno inválida. SERVICE_ID não foi encontrado."
    );
    assert.exists(
      data[0].id_user,
      "Estrutura de retorno inválida. ID_USER não foi encontrado."
    );
    assert.exists(
      data[0].external_sale_id,
      "Estrutura de retorno inválida. EXTERNAL_SALE_ID não foi encontrado."
    );
    assert.exists(
      data[0].value,
      "Estrutura de retorno inválida. VALUE não foi encontrado."
    );
    assert.exists(
      data[0].description,
      "Estrutura de retorno inválida. DESCRIPTION não foi encontrado."
    );
    assert.exists(
      data[0].id_payment,
      "Estrutura de retorno inválida. ID_PAYMENT não foi encontrado."
    );
    assert.exists(
      data[0].sufix_card_number,
      "Estrutura de retorno inválida. SUFIX_CARD_NUMBER não foi encontrado."
    );
    assert.exists(
      data[0].owner_name_card,
      "Estrutura de retorno inválida. OWNER_NAME_CARD não foi encontrado."
    );
    assert.exists(
      data[0].dueDate_card,
      "Estrutura de retorno inválida. DUEDATE_CARD não foi encontrado."
    );
    assert.exists(
      data[0].cvv_card,
      "Estrutura de retorno inválida. CVV_CARD não foi encontrado."
    );
  });

  it("Devemos conseguir incluir transações como crédito e o payable deve retornar waiting_funds", async () => {
    const finds = await global.dbConnection.query(
      `SELECT "id" FROM "users" WHERE "username" = 'ROOT';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(finds, "Não foi encontrado ambiente 'ROOT'.");

    const id_user = finds[0].id;
    const service_id = randomer.minMaxRandom(100, 999999).pad(10);
    const sale_id = randomer.minMaxRandom(100, 99999);
    const cardNumber = "9999999999999999";
    const ownerNameCard = "AUTO T EST";
    const dueDateCard = "01/25";
    const cvvCard = "159";

    const body = {
      service_id: service_id,
      id_user: id_user,
      external_sale_id: `SALE-${sale_id}`,
      value: 99.99,
      description: "Transação gerada pelo AutoTeste",
      str_code_payment: "credit_card",
      card_number: await authService.encodeToBase64(cardNumber),
      owner_name_card: await authService.encodeToBase64(ownerNameCard),
      dueDate_card: await authService.encodeToBase64(dueDateCard),
      cvv_card: await authService.encodeToBase64(cvvCard)
    };

    const response = await chai
      .request(app)
      .post("/transactions")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (POST:/transactions) - ${
        JSON.parse(response.text).message
      }`
    );

    const data = JSON.parse(response.text).data;

    assert.exists(
      data.status_refund,
      "Estrutura de retorno inválida. STATUS_REFUND não foi encontrado."
    );
    assert.equal(data.status_refund, global.WAITING_FUNDS);
  });

  it("Devemos conseguir antecipar uma transação criada em crédito", async () => {
    const finds = await global.dbConnection.query(
      `SELECT "id" FROM "users" WHERE "username" = 'ROOT';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(finds, "Não foi encontrado ambiente 'ROOT'.");

    const id_user = finds[0].id;
    const service_id = randomer.minMaxRandom(100, 999999).pad(10);
    const sale_id = randomer.minMaxRandom(100, 99999);
    const cardNumber = "9999999999999999";
    const ownerNameCard = "AUTO T EST";
    const dueDateCard = "01/25";
    const cvvCard = "159";

    const body = {
      service_id: service_id,
      id_user: id_user,
      external_sale_id: `SALE-${sale_id}`,
      value: 99.99,
      description: "Transação gerada pelo AutoTeste",
      str_code_payment: "credit_card",
      card_number: await authService.encodeToBase64(cardNumber),
      owner_name_card: await authService.encodeToBase64(ownerNameCard),
      dueDate_card: await authService.encodeToBase64(dueDateCard),
      cvv_card: await authService.encodeToBase64(cvvCard)
    };

    const response = await chai
      .request(app)
      .post("/transactions")
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN)
      .send(body);

    assert.equal(
      response.statusCode,
      200,
      `Não veio statusCode 200 (POST:/transactions) - ${
        JSON.parse(response.text).message
      }`
    );

    const data = JSON.parse(response.text).data;
    assert.exists(data.payableGuid, "Não foi retornado GUID");
    const payableGuid = data.payableGuid;

    let responseAntecipate = await chai
      .request(app)
      .post(`/payables/${payableGuid}/antecipate`)
      .set("x-access-token", global.AUTOTEST_ACCESS_TOKEN);

    assert.equal(
      responseAntecipate.statusCode,
      200,
      `Não veio statusCode 200 (POST:/payables/:guid) - ${
        JSON.parse(responseAntecipate.text).message
      }`
    );

    responseAntecipate = JSON.parse(responseAntecipate.text).data;
    assert.exists(
      responseAntecipate.paid_guid,
      "Não foi encontrado PAID_GUID na reposta"
    );
    assert.exists(
      responseAntecipate.status,
      "Não foi encontrado STATUS na reposta"
    );
    assert.exists(
      responseAntecipate.paid_date,
      "Não foi encontrado PAID_DATE na reposta"
    );
    assert.exists(
      responseAntecipate.before_value,
      "Não foi encontrado BEFORE_VALUE na reposta"
    );
    assert.exists(
      responseAntecipate.discounted_value,
      "Não foi encontrado DISCOUNTED_VALUE na reposta"
    );
    assert.exists(
      responseAntecipate.refunded_value,
      "Não foi encontrado REFUNDED_VALUE na reposta"
    );

    const findPaid = await global.dbConnection.query(
      `SELECT "id" FROM "paids" WHERE "guid" = '${responseAntecipate.paid_guid}';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    assert.isNotEmpty(findPaid, "Não foi encontrado pagamento de antecipação.");
  });
});
