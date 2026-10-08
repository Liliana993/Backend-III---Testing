import express from "express";
import cors from "cors";
import config from "./config/env.config.js";
import ordersRouter from "./routes/orders.js";
import deliveriesRouter from "./routes/deliveries.js";
import userRouter from "./routes/users.js";
import productRouter from "./routes/producto.js";
import mockRouter from "./routes/mock.js";
import loggerRouter from "./routes/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import CustomError from "./errors/CustomError.js";
import { ERROR_TYPES } from "./constants/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/users", userRouter);
app.use("/api/mocks", mockRouter);
app.use("/api/products", productRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use("/api/logger", loggerRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.environment
  });
});

// Catch all para rutas no encontradas
app.use((req, res, next) => {
  next(
    CustomError.createError({
      name: ERROR_TYPES.ROUTE_NOT_FOUND,
      cause: `La ruta ${req.method} ${req.originalUrl} no existe`
    })
  );
});

// Middleware de manejo de errores
app.use(errorHandler);

export default app;