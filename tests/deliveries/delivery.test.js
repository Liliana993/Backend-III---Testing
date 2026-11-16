
import { unlink } from "node:fs/promises";
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

// Crea un usuario, una orden y un delivery para las pruebas
async function createDelivery() {
  const userResponse = await request(app)
    .post("/api/users")
    .send({
      firstName: "Ana",
      lastName: "Lopez",
      email: "ana.deliveries@example.com",
      password: "Password123"
    });

  const customerId = userResponse.body.payload._id;

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

  const deliveryResponse = await request(app)
    .post("/api/deliveries")
    .send({
      order: orderId
    });

  return deliveryResponse.body.payload._id;
}

describe("POST /api/deliveries/:id/proofs", function () {

  it("Debe crear un delivery de prueba correctamente", async function () {
    const deliveryId = await createDelivery();

    expect(deliveryId).to.exist;
  });

  it("Debe cargar varios comprobantes correctamente", async function () {
    const deliveryId = await createDelivery();

    let uploadedFilePaths = [];

    try {
      const response = await request(app)
        .post(`/api/deliveries/${deliveryId}/proofs`)
        .attach("proof", Buffer.from("%PDF-1.4\nComprobante 1"), {
          filename: "comprobante1.pdf",
          contentType: "application/pdf"
        })
        .attach("proof", Buffer.from("%PDF-1.4\nComprobante 2"), {
          filename: "comprobante2.pdf",
          contentType: "application/pdf"
        });

      const proofs = response.body.payload?.proofs;

      uploadedFilePaths = proofs?.map(proof => proof.path) || [];

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(proofs).to.be.an("array").with.lengthOf(2);

      expect(proofs[0].originalName).to.equal("comprobante1.pdf");
      expect(proofs[0].mimetype).to.equal("application/pdf");

      expect(proofs[1].originalName).to.equal("comprobante2.pdf");
      expect(proofs[1].mimetype).to.equal("application/pdf");

      proofs.forEach(proof => {
        expect(proof.filename).to.exist;
        expect(proof.path).to.exist;
        expect(proof.size).to.be.greaterThan(0);
        expect(proof.uploadedAt).to.exist;
      });

    } finally {
      await Promise.all(
        uploadedFilePaths.map(path => unlink(path).catch(() => {}))
      );
    }
  });


  it("Debe devolver 400 cuando no se adjunta ningún comprobante", async function () {
    const deliveryId = await createDelivery();

    const response = await request(app)
      .post(`/api/deliveries/${deliveryId}/proofs`);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
  });


  it("Debe devolver 400 cuando el formato del comprobante es inválido", async function () {
    const deliveryId = await createDelivery();

    const response = await request(app)
      .post(`/api/deliveries/${deliveryId}/proofs`)
      .attach("proof", Buffer.from("Archivo de prueba"), {
        filename: "comprobante.txt",
        contentType: "text/plain"
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
  });


  it("Debe rechazar más de cinco comprobantes en una solicitud", async function () {
    const deliveryId = await createDelivery();

    let uploadedFilePaths = [];

    const response = await request(app)
      .post(`/api/deliveries/${deliveryId}/proofs`)
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 1"), {
        filename: "comprobante1.pdf",
        contentType: "application/pdf"
      })
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 2"), {
        filename: "comprobante2.pdf",
        contentType: "application/pdf"
      })
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 3"), {
        filename: "comprobante3.pdf",
        contentType: "application/pdf"
      })
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 4"), {
        filename: "comprobante4.pdf",
        contentType: "application/pdf"
      })
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 5"), {
        filename: "comprobante5.pdf",
        contentType: "application/pdf"
      })
      .attach("proof", Buffer.from("%PDF-1.4\nComprobante 6"), {
        filename: "comprobante6.pdf",
        contentType: "application/pdf"
      });

    uploadedFilePaths =
      response.body.payload?.proofs?.map(proof => proof.path) || [];

    try {
      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
    } finally {
      await Promise.all(
        uploadedFilePaths.map(path => unlink(path).catch(() => {}))
      );
    }
  });

  it("Debe devolver 404 cuando se intenta cargar comprobantes en un delivery inexistente", async function () {
  const response = await request(app)
    .post("/api/deliveries/000000000000000000000000/proofs")
    .attach("proof", Buffer.from("%PDF-1.4\nComprobante"), {
      filename: "comprobante.pdf",
      contentType: "application/pdf"
    });

  expect(response.status).to.equal(404);
  expect(response.body.status).to.equal("error");
});

it("Debe devolver 413 cuando un comprobante supera los 5 MB", async function () {
  const deliveryId = await createDelivery();

  const oversizedFile = Buffer.alloc(5 * 1024 * 1024 + 1);

  const response = await request(app)
    .post(`/api/deliveries/${deliveryId}/proofs`)
    .attach("proof", oversizedFile, {
      filename: "comprobante-grande.pdf",
      contentType: "application/pdf"
    });

  expect(response.status).to.equal(413);
  expect(response.body.status).to.equal("error");
});

});
