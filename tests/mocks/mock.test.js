
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/mocks/users", function () {

  it("Debe generar la cantidad solicitada de usuarios ficticios", async function () {
    const response = await request(app)
      .get("/api/mocks/users?qty=3");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.count).to.equal(3);
    expect(response.body.data).to.be.an("array").with.lengthOf(3);

    expect(response.body.data[0]).to.have.property("firstName");
    expect(response.body.data[0]).to.have.property("lastName");
    expect(response.body.data[0]).to.have.property("email");
  });

  it("Debe rechazar una cantidad igual a cero", async function () {
    const response = await request(app)
      .get("/api/mocks/users?qty=0");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });

  it("Debe rechazar una cantidad superior a 50", async function () {
    const response = await request(app)
      .get("/api/mocks/users?qty=51");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });

  it("No debe guardar los usuarios ficticios en MongoDB", async function () {
    await request(app)
      .get("/api/mocks/users?qty=3");

    const response = await request(app)
      .get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an("array").that.is.empty;
  });

});

describe("GET /api/mocks/drivers", function () {

  it("Debe generar la cantidad solicitada de conductores ficticios", async function () {
    const response = await request(app)
      .get("/api/mocks/drivers?qty=3");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.count).to.equal(3);
    expect(response.body.data).to.be.an("array").with.lengthOf(3);

    expect(response.body.data[0]).to.have.property("firstName");
    expect(response.body.data[0]).to.have.property("lastName");
    expect(response.body.data[0]).to.have.property("email");
  });

  it("Debe rechazar una cantidad igual a cero", async function () {
    const response = await request(app)
      .get("/api/mocks/drivers?qty=0");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });

  it("Debe rechazar una cantidad superior a 50", async function () {
    const response = await request(app)
      .get("/api/mocks/drivers?qty=51");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });


describe("POST /api/mocks/seed", function () {
  it("Debe insertar correctamente los datos de prueba", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=2");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal(
      "Datos de prueba insertados correctamente"
    );

    expect(response.body.data).to.have.property("inserted");

    const inserted = response.body.data.inserted;

    expect(inserted.users).to.equal(4);
    expect(inserted.customers).to.equal(2);
    expect(inserted.drivers).to.equal(2);
    expect(inserted.orders).to.equal(2);
    expect(inserted.deliveries).to.equal(2);
  });

  it("Debe rechazar una cantidad igual a cero", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=0");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });

  it("Debe rechazar una cantidad superior a 50", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=51");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });

  it("Debe rechazar una cantidad que no sea un número entero", async function () {
    const response = await request(app)
      .post("/api/mocks/seed?qty=2.5");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("INVALID_QUANTITY");
  });
});

});
