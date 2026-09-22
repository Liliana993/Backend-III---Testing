import { Router } from "express";
import deliveryController from "../controllers/delivery.controller.js";

const router = Router();

router.get("/", deliveryController.getAll);

router.get("/order/:orderId", deliveryController.getByOrder);

router.get("/driver/:driverId", deliveryController.getByDriver);

router.get("/:id", deliveryController.getById);

router.post("/", deliveryController.create);

router.patch("/:id/assign", deliveryController.assignDriver);

router.patch("/:id/start", deliveryController.startDelivery);

router.patch("/:id/complete", deliveryController.completeDelivery);

router.patch("/:id/priority", deliveryController.updatePriority);

router.delete("/:id", deliveryController.delete);

export default router;