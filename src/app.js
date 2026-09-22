import express from "express";
import cors from "cors";
import config from "./config/config.js";
import ordersRouter from "./routes/orders.js";
import deliveriesRouter from "./routes/deliveries.js";
import userRouter from "./routes/users.js";
import productRouter from "./routes/producto.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/deliveries', deliveriesRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    enviroment: config.enviroment
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada"
  });
});

export default app;