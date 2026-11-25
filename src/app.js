// Creación de la aplicación Express
import express from "express";
import cors from "cors";
import config from "./config/env.config.js";
// Importación de rutas
import ordersRouter from "./routes/orders.js";
import deliveriesRouter from "./routes/deliveries.js";
import userRouter from "./routes/users.js";
import productRouter from "./routes/producto.js";
import mockRouter from "./routes/mock.js";
import loggerRouter from "./routes/logger.js";
// Importación de middlewares y utilidades
import errorHandler from "./middlewares/errorHandler.js";
import CustomError from "./errors/CustomError.js";
import { ERROR_TYPES } from "./constants/index.js";
// Importación de Swagger
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
// Creación de la aplicación Express
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger
// Documentación Swagger (solo en desarrollo y testing)
if (config.environment !== "production") {
  app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

// Rutas
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/deliveries", deliveriesRouter);
// Rutas internas (solo en desarrollo y testing)
if (config.environment !== "production") {
  app.use("/api/mocks", mockRouter);
  app.use("/api/logger", loggerRouter);
}


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.environment, // Entorno de ejecución (development, production, test)
    uptime: process.uptime(), // Tiempo de actividad del proceso en segundos
  });
});

// Catch-all para rutas no encontradas
app.use((req, res, next) => {
  next(
    CustomError.createError({
      name: ERROR_TYPES.ROUTE_NOT_FOUND,
      cause: `La ruta ${req.method} ${req.originalUrl} no existe`,
    })
  );
});

// Middleware centralizado de errores
app.use(errorHandler);

export default app;