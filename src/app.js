import express from "express";
import cors from "cors";
import config from "./config/env.config.js";
import ordersRouter from "./routes/orders.js";
import deliveriesRouter from "./routes/deliveries.js";
import userRouter from "./routes/users.js";
import productRouter from "./routes/producto.js";
import mockRouter from "./routes/mock.js";
import errorHandler from "./middlewares/errorHandler.js";
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
app.use(errorHandler); // Middleware de manejo de errores

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.environment
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada"
  });
});

export default app;