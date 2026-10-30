
import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesGlob = path
  .resolve(__dirname, "../routes/**/*.js")
  .replace(/\\/g, "/");

const docsGlob = path
  .resolve(__dirname, "../docs/**/*.js")
  .replace(/\\/g, "/");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description: "Documentación de la API de gestión de envíos ShipNow.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: [routesGlob, docsGlob],
};

console.log("Swagger busca rutas en:", routesGlob);
console.log("Swagger busca esquemas en:", docsGlob);

const swaggerSpec = swaggerJSDoc(swaggerOptions);

console.log("Swagger paths:", Object.keys(swaggerSpec.paths || {}));
console.log(
  "Swagger schemas:",
  Object.keys(swaggerSpec.components?.schemas || {})
);

export default swaggerSpec;