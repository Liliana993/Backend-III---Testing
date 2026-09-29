import { Router } from "express";

import mockController from "../controllers/mock.controller.js";

const router = Router();

router.get(
    "/users",
    mockController.getUsers
);

router.get(
    "/drivers",
    mockController.getDrivers
);

router.post(
    "/seed",
    mockController.seed
);

export default router;