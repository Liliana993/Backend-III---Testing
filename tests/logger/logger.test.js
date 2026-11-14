
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/logger/test", function () {
  it("Debe ejecutar correctamente los niveles de logging", async function () {
    const response = await request(app)
      .get("/api/logger/test");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body.status).to.equal("success");

    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");
    expect(response.body.message).to.not.be.empty;
  });
});
