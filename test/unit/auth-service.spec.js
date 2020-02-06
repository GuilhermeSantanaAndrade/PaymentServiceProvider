global.AUTO_TEST = true;

const chai = require("chai");
const chaiHttp = require("chai-http");
const authService = require("../../src/services/auth-service.js");

const assert = chai.assert;
chai.use(chaiHttp);

describe("Segurança", () => {
  it("Teste Unitário para Encode64", async () => {
    const result = await authService.encodeToBase64("ROOT");
    assert.equal(result, "Uk9PVA==");
  });

  it("Teste Unitário para Decode64", async () => {
    const result = await authService.decodeBase64("Uk9PVA==");
    assert.equal(result, "ROOT");
  });

  it("Teste Unitário para generateToken", async () => {
    const body = {
      username: "ROOT",
      user_admin: true
    };

    const result = await authService.generateToken(body);
    assert.isNotEmpty(result);
    assert.isString(result);
  });

  it("Teste Unitário para decodeToken", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJPT1QiLCJ1c2VyX2FkbWluIjp0cnVlLCJpYXQiOjE1ODA5NDM2MzcsImV4cCI6MTU4MTAzMDAzN30.e4yvko4hbv9aWZgreY2tCIVHU7g6ZbptDnpBaR6oT34";

    const result = await authService.decodeToken(token);
    assert.isNotEmpty(result);
    assert.isObject(result);
    assert.exists(result.username);
    assert.exists(result.user_admin);
  });
});
