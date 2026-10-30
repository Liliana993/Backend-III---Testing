import { Router } from "express";
import mockController from "../controllers/mock.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Mocks
 *     description: Generación y consulta de datos ficticios para pruebas.
 */

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Generar usuarios ficticios
 *     description: Genera usuarios de prueba sin guardarlos en la base de datos.
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de usuarios ficticios que se desea generar.
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         example: 10
 *     responses:
 *       200:
 *         description: Usuarios generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Datos de un usuario ficticio.
 *                     properties:
 *                       first_name:
 *                         type: string
 *                         example: Juan
 *                       last_name:
 *                         type: string
 *                         example: Pérez
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: juan.perez@example.com
 *       400:
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: INVALID_QUANTITY
 *               message: La cantidad solicitada no es válida.
 *       500:
 *         description: Error al generar los usuarios.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: MOCK_GENERATION_ERROR
 *               message: Error al generar usuarios ficticios.
 */
router.get("/users", mockController.getUsers);

/**
 * @swagger
 * /api/mocks/drivers:
 *   get:
 *     summary: Generar conductores ficticios
 *     description: Genera conductores de prueba sin guardarlos en la base de datos.
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de conductores ficticios que se desea generar.
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         example: 10
 *     responses:
 *       200:
 *         description: Conductores generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Datos de un conductor ficticio.
 *                     properties:
 *                       first_name:
 *                         type: string
 *                         example: Carlos
 *                       last_name:
 *                         type: string
 *                         example: Gómez
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: carlos.gomez@example.com
 *       400:
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: INVALID_QUANTITY
 *               message: La cantidad solicitada no es válida.
 *       500:
 *         description: Error al generar los conductores.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: MOCK_GENERATION_ERROR
 *               message: Error al generar conductores ficticios.
 */
router.get("/drivers", mockController.getDrivers);

/**
 * @swagger
 * /api/mocks/seed:
 *   post:
 *     summary: Insertar datos ficticios en la base de datos
 *     description: >
 *       Genera e inserta datos de prueba para usuarios, clientes,
 *       conductores, pedidos y entregas. Las entregas se relacionan
 *       con sus respectivos pedidos.
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: true
 *         description: >
 *           Cantidad solicitada de clientes, conductores, pedidos y entregas.
 *           La cantidad de usuarios insertados puede ser diferente.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         example: 10
 *     responses:
 *       201:
 *         description: Datos de prueba insertados correctamente.
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
 *                   example: Datos de prueba insertados correctamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     inserted:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: integer
 *                           example: 20
 *                         customers:
 *                           type: integer
 *                           example: 10
 *                         drivers:
 *                           type: integer
 *                           example: 10
 *                         orders:
 *                           type: integer
 *                           example: 10
 *                         deliveries:
 *                           type: integer
 *                           example: 10
 *       400:
 *         description: Cantidad inválida o parámetros incorrectos.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: INVALID_QUANTITY
 *               message: La cantidad solicitada no es válida.
 *       500:
 *         description: Error al generar o guardar los datos de prueba.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error: MOCK_DATABASE_ERROR
 *               message: Error al insertar los datos de prueba.
 */
router.post("/seed", mockController.seed);

export default router;