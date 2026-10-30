import { Router } from "express";
import loggerController from "../controllers/logger.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Logger
 *     description: Pruebas de los niveles de logging de ShipNow.
 */

/**
 * @swagger
 * /api/logger/test:
 *   get:
 *     summary: Probar los niveles de logging
 *     description: >
 *       Ejecuta mensajes de prueba en los niveles DEBUG, HTTP, INFO,
 *       WARNING, ERROR y FATAL. Permite comprobar que el logger
 *       procese los distintos niveles configurados.
 *     tags: [Logger]
 *     responses:
 *       200:
 *         description: Todos los niveles de logging fueron ejecutados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Todos los niveles de logging fueron ejecutados correctamente.
 *       500:
 *         description: Error interno durante la prueba de logging.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/test", loggerController.testLevels);

export default router;