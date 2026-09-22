import { Router } from "express";
import orderController from "../controllers/order.controller.js";

const router = Router();

router.get("/", orderController.getAll);

router.get("/:id", orderController.getOrderById);

router.post("/", orderController.create);

router.put("/:id", orderController.update);

router.delete("/:id", orderController.delete);

export default router;