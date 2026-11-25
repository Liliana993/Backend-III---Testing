
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /api/orders", function () {

  it("Debe devolver 200 y una lista de órdenes", async function () {
    const response = await request(app)
      .get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");
  });

  it("Debe devolver un array vacío cuando no hay órdenes", async function () {
    const response = await request(app)
      .get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an("array");
    expect(response.body.payload).to.have.lengthOf(0);
  });

  it("Debe devolver órdenes paginadas con page y limit", async () => {
  // Crear tres órdenes con sus respectivos clientes
  for (let i = 1; i <= 3; i++) {
    const userRes = await request(app)
      .post("/api/users")
      .send({
        firstName: "Cliente",
        lastName: `Prueba${i}`,
        email: `pagination.order${i}@example.com`,
        password: "Password123"
      });

    const customerId = userRes.body.payload._id;

    await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Av. San Martin 123",
        items: [
          {
            name: "Producto de prueba",
            quantity: 2,
            price: 1500
          }
        ]
      });
  }

  const res = await request(app)
    .get("/api/orders?page=1&limit=2");

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

it("Debe devolver un array vacío cuando la página de órdenes está fuera de rango", async () => {
  const res = await request(app)
    .get("/api/orders?page=10&limit=2");

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

describe("POST /api/orders", function () {

  it("Debe crear una orden correctamente", async function () {

    // Primero creamos el cliente
    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Ana",
        lastName: "Lopez",
        email: "ana.orders@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    // Creamos la orden utilizando el ID del cliente
    const response = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Av. San Martin 123",
        items: [
          {
            name: "Producto de prueba",
            quantity: 2,
            price: 1500
          }
        ]
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.deliveryAddress)
      .to.equal("Av. San Martin 123");
  });

  it("Debe rechazar una orden sin productos", async function () {

    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Pedro",
        lastName: "Gomez",
        email: "pedro.orders@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    const response = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Calle de prueba 456",
        items: []
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
  });

});

describe("GET /api/orders/:id", function () {

  it("Debe devolver una orden cuando el ID existe", async function () {

    // Creamos un cliente
    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Maria",
        lastName: "Gomez",
        email: "maria.orders@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    // Creamos una orden
    const orderResponse = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Av. San Martin 123",
        items: [
          {
            name: "Producto de prueba",
            quantity: 2,
            price: 1500
          }
        ]
      });

    const orderId = orderResponse.body.payload._id;

    // Buscamos la orden
    const response = await request(app)
      .get(`/api/orders/${orderId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload._id).to.equal(orderId);
  });

  it("Debe devolver 404 cuando la orden no existe", async function () {

    const response = await request(app)
      .get("/api/orders/000000000000000000000000");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
    expect(response.body.cause).to.include("No existe una orden con id");
  });

});


describe("PUT /api/orders/:id", function () {

  it("Debe actualizar el estado de una orden correctamente", async function () {

    // Creamos un cliente
    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Laura",
        lastName: "Perez",
        email: "laura.orders@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    // Creamos una orden
    const orderResponse = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Av. San Martin 123",
        items: [
          {
            name: "Producto de prueba",
            quantity: 2,
            price: 1500
          }
        ]
      });

    const orderId = orderResponse.body.payload._id;

    // Actualizamos su estado
    const response = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({
        status: "assigned"
      });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.status).to.equal("assigned");
  });

  it("Debe rechazar un estado inválido", async function () {

    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Pedro",
        lastName: "Gomez",
        email: "pedro.invalid@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    const orderResponse = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Calle de prueba 456",
        items: [
          {
            name: "Producto de prueba",
            quantity: 1,
            price: 1000
          }
        ]
      });

    const orderId = orderResponse.body.payload._id;

    const response = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({
        status: "estado_invalido"
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("VALIDATION_ERROR");
    expect(response.body.message).to.include("Validation failed");
    expect(response.body.message).to.include("estado_invalido");
  });

  it("Debe devolver 404 al actualizar una orden inexistente", async function () {

    const response = await request(app)
      .put("/api/orders/000000000000000000000000")
      .send({
        status: "assigned"
      });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
    expect(response.body.cause).to.include("No existe una orden con id");
  });

});


describe("DELETE /api/orders/:id", function () {

  it("Debe eliminar una orden correctamente", async function () {

    // Creamos un cliente
    const userResponse = await request(app)
      .post("/api/users")
      .send({
        firstName: "Carlos",
        lastName: "Perez",
        email: "carlos.delete@example.com",
        password: "Password123"
      });

    const customerId = userResponse.body.payload._id;

    // Creamos una orden
    const orderResponse = await request(app)
      .post("/api/orders")
      .send({
        customer: customerId,
        deliveryAddress: "Calle de prueba 123",
        items: [
          {
            name: "Producto de prueba",
            quantity: 1,
            price: 1000
          }
        ]
      });

    const orderId = orderResponse.body.payload._id;

    // Eliminamos la orden
    const response = await request(app)
      .delete(`/api/orders/${orderId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");

    // Comprobamos que ya no existe
    const searchResponse = await request(app)
      .get(`/api/orders/${orderId}`);

    expect(searchResponse.status).to.equal(404);
  });

  it("Debe devolver 404 al eliminar una orden inexistente", async function () {

    const response = await request(app)
      .delete("/api/orders/000000000000000000000000");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
    expect(response.body.cause).to.include("No existe una orden con id");
  });

});
