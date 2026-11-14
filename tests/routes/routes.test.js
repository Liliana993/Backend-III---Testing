
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Rutas inexistentes", function () {

  it("Debe devolver 404 cuando se consulta una ruta que no existe", async function () {
    const response = await request(app)
      .get("/api/ruta-inexistente");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("ROUTE_NOT_FOUND");
    expect(response.body.message).to.be.a("string");
    expect(response.body.message).to.not.be.empty;
  });

});
