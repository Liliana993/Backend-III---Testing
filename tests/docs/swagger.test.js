
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api-docs", function () {
  it("Debe mostrar correctamente la documentación Swagger", async function () {
    const response = await request(app)
      .get("/api-docs/");

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.include("text/html");
    expect(response.text).to.include("swagger-ui");
  });
});
