import { Router } from "express";
import productController from "../controllers/producto.controller.js";

const router = Router();

router.get("/", productController.getAll);

router.get("/name/:name", productController.getByName);

router.get("/:id", productController.getById);

router.post("/", productController.create);

router.put("/:id", productController.update);

router.delete("/:id", productController.delete);

export default router;