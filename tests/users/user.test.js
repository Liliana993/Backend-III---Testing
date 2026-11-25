import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/users", function () {

  it("Debe devolver 200 y una lista de usuarios", async function () {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
  });

  it("Debe devolver un array vacío cuando no hay usuarios", async function () {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an("array");
    expect(response.body.payload).to.have.lengthOf(0);
  });

  it("Debe devolver usuarios paginados con page y limit", async () => {
  // Crear tres usuarios de prueba
  await request(app).post("/api/users").send({
    firstName: "Usuario",
    lastName: "Uno",
    email: "pagination1@example.com",
    password: "Password123"
  });

  await request(app).post("/api/users").send({
    firstName: "Usuario",
    lastName: "Dos",
    email: "pagination2@example.com",
    password: "Password123"
  });

  await request(app).post("/api/users").send({
    firstName: "Usuario",
    lastName: "Tres",
    email: "pagination3@example.com",
    password: "Password123"
  });

  const res = await request(app)
    .get("/api/users?page=1&limit=2");

  expect(res.status).to.equal(200);
  expect(res.body.status).to.equal("success");
  expect(res.body.payload).to.be.an("array");
  expect(res.body.payload).to.have.lengthOf(2);

  expect(res.body.pagination).to.deep.equal({
    total: 3,
    page: 1,
    limit: 2,
    totalPages: 2
  });
});

it("Debe devolver un array vacío cuando la página está fuera de rango", async () => {
  const res = await request(app)
    .get("/api/users?page=10&limit=2");

  expect(res.status).to.equal(200);
  expect(res.body.payload).to.be.an("array").that.is.empty;

  expect(res.body.pagination).to.deep.equal({
    total: 0,
    page: 10,
    limit: 2,
    totalPages: 0
  });
});

});

describe("POST /api/users", function () {

  it("Debe crear un usuario correctamente", async function () {
    const newUser = {
      firstName: "Liliana",
      lastName: "Escobar",
      email: "test@example.com",
      password: "Password123"
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.email).to.equal("test@example.com");
  });

  it("Debe rechazar un usuario sin email", async function () {
    const newUser = {
      firstName: "Ana",
      lastName: "Lopez",
      password: "Password123"
    };

    const response = await request(app)
      .post("/api/users")
      .send(newUser);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("VALIDATION_ERROR");
    expect(response.body.message).to.be.a("string").and.not.empty;
  });

  it("No debe permitir emails duplicados", async function () {
    const newUser = {
      firstName: "Ana",
      lastName: "Lopez",
      email: "duplicado@example.com",
      password: "Password123"
    };

    await request(app)
      .post("/api/users")
      .send(newUser);

    const response = await request(app)
      .post("/api/users")
      .send(newUser);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.be.a("string").and.not.empty;
    expect(response.body.message).to.be.a("string").and.not.empty;
  });


it("Debe rechazar un body que supera el tamaño máximo permitido", async function () {
  const response = await request(app)
    .post("/api/users")
    .send({
      data: "a".repeat(1024 * 1024 + 1)
    });

  expect(response.status).to.equal(413);
  expect(response.body.status).to.equal("error");
  expect(response.body.error).to.equal("PAYLOAD_TOO_LARGE");
  expect(response.body.message).to.equal(
    "El cuerpo de la solicitud supera el tamaño máximo permitido"
  );
});


});

describe("GET /api/users/:id", function () {

  it("Debe devolver un usuario cuando el ID existe", async function () {
    const createdUser = await request(app)
      .post("/api/users")
      .send({
        firstName: "Ana",
        lastName: "Lopez",
        email: "ana@example.com",
        password: "Password123"
      });

    const userId = createdUser.body.payload._id;

    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload._id).to.equal(userId);
    expect(response.body.payload.email).to.equal("ana@example.com");
  });

  it("Debe devolver 404 cuando el usuario no existe", async function () {
    const response = await request(app)
      .get("/api/users/000000000000000000000000");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });

});

describe("PUT /api/users/:id", function () {

  it("Debe actualizar un usuario correctamente", async function () {
    const createdUser = await request(app)
      .post("/api/users")
      .send({
        firstName: "Ana",
        lastName: "Lopez",
        email: "ana@example.com",
        password: "Password123"
      });

    const userId = createdUser.body.payload._id;

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        firstName: "Ana Maria"
      });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.firstName).to.equal("Ana Maria");
  });

  it("Debe devolver 404 al actualizar un usuario inexistente", async function () {
    const response = await request(app)
      .put("/api/users/000000000000000000000000")
      .send({
        firstName: "Usuario inexistente"
      });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });

});

describe("DELETE /api/users/:id", function () {

  it("Debe eliminar un usuario correctamente", async function () {
    const createdUser = await request(app)
      .post("/api/users")
      .send({
        firstName: "Carlos",
        lastName: "Perez",
        email: "carlos@example.com",
        password: "Password123"
      });

    const userId = createdUser.body.payload._id;

    const response = await request(app)
      .delete(`/api/users/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");

    const searchResponse = await request(app)
      .get(`/api/users/${userId}`);

    expect(searchResponse.status).to.equal(404);
  });

  it("Debe devolver 404 al eliminar un usuario inexistente", async function () {
    const response = await request(app)
      .delete("/api/users/000000000000000000000000");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });

});

it("Debe devolver 404 cuando el usuario no existe", async function () {
  const nonExistentId = "000000000000000000000000";

  const response = await request(app)
    .post(`/api/users/${nonExistentId}/documents`)
    .field("documentType", "DNI")
    .attach(
      "document",
      Buffer.from("%PDF-1.4\nDocumento de prueba"),
      {
        filename: "documento.pdf",
        contentType: "application/pdf"
      }
    );

  expect(response.status).to.equal(404);
  expect(response.body.status).to.equal("error");
  expect(response.body.error).to.equal("USER_NOT_FOUND");
  expect(response.body.message).to.equal("Usuario no encontrado");
  expect(response.body.cause).to.equal(
    `No existe un usuario con id ${nonExistentId}`
  );
});


describe("POST /api/users/:id/documents", function () {

  let userId;

  beforeEach(async function () {
    const createdUser = await request(app)
      .post("/api/users")
      .send({
        firstName: "Liliana",
        lastName: "Escobar",
        email: `test-${Date.now()}@example.com`,
        password: "Password123"
      });

    userId = createdUser.body.payload._id;
  });

  it("Debe cargar un documento de usuario correctamente", async function () {
  const response = await request(app)
    .post(`/api/users/${userId}/documents`)
    .field("documentType", "DNI")
    .attach(
      "document",
      Buffer.from("%PDF-1.4\nDocumento de prueba"),
      {
        filename: "documento.pdf",
        contentType: "application/pdf"
      }
    );

  expect(response.status).to.equal(201);
  expect(response.body.status).to.equal("success");
  expect(response.body.message).to.equal("Documento cargado correctamente");

  const documents = response.body.payload.documents;

  expect(documents).to.be.an("array").with.lengthOf(1);

  expect(documents[0]).to.include({
    originalName: "documento.pdf",
    mimetype: "application/pdf",
    documentType: "DNI"
  });

  expect(documents[0].filename).to.be.a("string").and.not.empty;
  expect(documents[0].path).to.be.a("string").and.not.empty;
  expect(documents[0].size).to.be.a("number").and.greaterThan(0);
  expect(documents[0].uploadedAt).to.exist;
});

  it("Debe rechazar la carga cuando documentType es inválido", async function () {
  const response = await request(app)
    .post(`/api/users/${userId}/documents`)
    .field("documentType", "INVALIDO")
    .attach(
      "document",
      Buffer.from("%PDF-1.4\nDocumento de prueba"),
      {
        filename: "documento.pdf",
        contentType: "application/pdf"
      }
    );

  expect(response.status).to.equal(400);
  expect(response.body.status).to.equal("error");
  expect(response.body.error).to.equal("INVALID_DOCUMENT_TYPE");
  expect(response.body.message).to.equal("Tipo de documento inválido");
});

});
