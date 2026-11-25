import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/products", function () {

  it("Debe devolver 200 y una lista de productos paginados", async function () {
    const response = await request(app)
      .get("/api/products?page=1&limit=10");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");

    expect(response.body.pagination).to.have.all.keys(
      "total",
      "page",
      "limit",
      "totalPages"
    );

    expect(response.body.pagination.page).to.equal(1);
    expect(response.body.pagination.limit).to.equal(10);
  });

  it("Debe rechazar un límite que no sea numérico", async function () {
    const response = await request(app)
      .get("/api/products?limit=abc");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("VALIDATION_ERROR");
  });

  it("Debe rechazar un límite superior a 100", async function () {
    const response = await request(app)
      .get("/api/products?limit=101");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("VALIDATION_ERROR");
  });

  it("Debe rechazar una página inválida", async function () {
    const response = await request(app)
      .get("/api/products?page=abc");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("VALIDATION_ERROR");
  });

});