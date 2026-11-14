
import mongoose from "mongoose";
import config from "../src/config/env.config.js";

export const mochaHooks = {
  async beforeAll() {
    // Protección para evitar borrar otra base de datos
    const databaseName = new URL(config.mongodbUri).pathname.replace(/^\/+/, "");

    if (
      config.environment !== "test" ||
      databaseName !== "shipnow_test"
    ) {
      throw new Error(
        "Configuración insegura: los tests deben utilizar exclusivamente shipnow_test"
      );
    }

    await mongoose.connect(config.mongodbUri);

    console.log("Conectado a MongoDB para testing");
  },

  async beforeEach() {
    // Limpiar las colecciones antes de cada prueba
    const collections = Object.values(mongoose.connection.collections);

    await Promise.all(
      collections.map((collection) => collection.deleteMany({}))
    );
  },

  async afterAll() {
    await mongoose.disconnect();

    console.log("Conexión de testing cerrada");
  }
};
