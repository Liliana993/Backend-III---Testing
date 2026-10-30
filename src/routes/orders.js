import { Router } from "express";
import orderController from "../controllers/order.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Gestión de órdenes de ShipNow
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Órdenes obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, message, payload]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Órdenes obtenidas exitosamente
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: No se pudo completar la operación
 */
router.get("/", orderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la orden
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Orden obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, message, payload]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Orden obtenida exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: El identificador proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: El identificador proporcionado no es válido
 *               cause: El identificador no tiene un formato válido
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: ORDER_NOT_FOUND
 *               message: Pedido no encontrado
 *               cause: No existe una orden con el identificador proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: No se pudo completar la operación
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una orden
 *     description: >
 *       Crea una orden para un cliente existente. El backend calcula
 *       declaredValue, shippingCost y total, establece el estado inicial
 *       y asigna prioridad normal cuando no se especifica una prioridad.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateInput'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, message, payload]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Orden creada exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos de la solicitud inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Error de validación
 *               cause: Los datos proporcionados no son válidos
 *       404:
 *         description: El cliente indicado no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un usuario con el identificador proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: No se pudo completar la operación
 */
router.post("/", orderController.create);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Actualizar una orden
 *     description: Actualiza una orden existente por su identificador.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la orden
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateInput'
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, message, payload]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Orden actualizada exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Identificador o datos de actualización inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Error de validación
 *               cause: El identificador o los datos proporcionados no son válidos
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: ORDER_NOT_FOUND
 *               message: Pedido no encontrado
 *               cause: No existe una orden con el identificador proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: No se pudo completar la operación
 */
router.put("/:id", orderController.update);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Eliminar una orden
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la orden
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, message, payload]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Orden eliminada exitosamente
 *                 payload:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: El identificador proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: El identificador proporcionado no es válido
 *               cause: El identificador no tiene un formato válido
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: ORDER_NOT_FOUND
 *               message: Pedido no encontrado
 *               cause: No existe una orden con el identificador proporcionado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: No se pudo completar la operación
 */
router.delete("/:id", orderController.delete);

export default router;