import { Router } from "express";
import deliveryController from "../controllers/delivery.controller.js";

import upload from "../config/multer.config.js";
import { MAX_FILES } from "../config/multer.config.js";

import {
  handleUploadError,
  validateUploadedFiles
} from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Deliveries
 *     description: Gestión de entregas de ShipNow
 */


/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtener todas las entregas
 *     description: Lista las entregas con paginación y permite filtrarlas por estado, prioridad y repartidor.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad máxima de entregas por página
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, assigned, in_transit, delivered]
 *         description: Filtrar por estado de la entrega
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *           enum: [low, normal, high]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: driver
 *         required: false
 *         schema:
 *           type: string
 *         description: Identificador del repartidor
 *     responses:
 *       200:
 *         description: Entregas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, payload, pagination]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
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
 *               cause: No se pudieron obtener las entregas
 */
router.get("/", deliveryController.getAll);

/**
 * @swagger
 * /api/deliveries/order/{orderId}:
 *   get:
 *     summary: Obtener entrega por orden
 *     description: Busca la entrega asociada a una orden.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Identificador de la orden
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Entrega obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: El identificador de la orden no es válido
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
 *         description: No se encontró una entrega para la orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega asociada a la orden indicada
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
 *               cause: No se pudo obtener la entrega
 */
router.get("/order/:orderId", deliveryController.getByOrder);


/**
 * @swagger
 * /api/deliveries/driver/{driverId}:
 *   get:
 *     summary: Obtener entregas por repartidor
 *     description: Lista las entregas asociadas a un repartidor con paginación.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         description: Identificador del repartidor
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad máxima de entregas por página
 *     responses:
 *       200:
 *         description: Entregas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: El identificador del repartidor no es válido
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
 *         description: Repartidor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un repartidor con el identificador proporcionado
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
 *               cause: No se pudieron obtener las entregas
 *
 */
router.get("/driver/:driverId", deliveryController.getByDriver);

// Cargar comprobantes de una entrega
router.post(
  "/:id/proofs",
  deliveryController.ensureExists,
  (req, res, next) => {
    req.uploadCategory = "deliveryProofs";
    next();
  },
  upload.array("proof", MAX_FILES),
  handleUploadError,
  validateUploadedFiles,
  deliveryController.uploadProofs
);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Obtener entrega por ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Entrega obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: El identificador de la entrega no es válido
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
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega con el identificador proporcionado
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
 *               cause: No se pudo obtener la entrega
 */
router.get("/:id", deliveryController.getById);

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Crear una entrega
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryCreateInput'
 *     responses:
 *       201:
 *         description: Entrega creada correctamente
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
 *                   example: Entrega creada correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Los datos de la entrega son inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_INVALID_DATA
 *               message: Datos de entrega inválidos
 *               cause: Revisá los datos enviados en la solicitud
 *       404:
 *         description: No se encontró la orden asociada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: ORDER_NOT_FOUND
 *               message: Pedido no encontrado
 *               cause: No existe la orden indicada
 *       409:
 *         description: Ya existe una entrega para la orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_ALREADY_EXISTS
 *               message: Ya existe una entrega para este pedido
 *               cause: La orden ya tiene una entrega asociada
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
 *               cause: No se pudo crear la entrega
 */
router.post("/", deliveryController.create);

/**
 * @swagger
 * /api/deliveries/{id}/assign:
 *   patch:
 *     summary: Asignar repartidor a una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignDriverInput'
 *     responses:
 *       200:
 *         description: Repartidor asignado correctamente
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
 *                   example: Repartidor asignado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Datos de asignación inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_INVALID_DATA
 *               message: Datos de entrega inválidos
 *               cause: Revisá los datos del repartidor
 *       404:
 *         description: Entrega o repartidor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No se encontró la entrega o el repartidor indicado
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
 *               cause: No se pudo asignar el repartidor
 */
router.patch("/:id/assign", deliveryController.assignDriver);

/**
 * @swagger
 * /api/deliveries/{id}/start:
 *   patch:
 *     summary: Iniciar una entrega
 *     description: Inicia el proceso de entrega.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Entrega iniciada correctamente
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
 *                   example: Entrega iniciada correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: El estado actual no permite iniciar la entrega
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_INVALID_STATUS
 *               message: El estado actual de la entrega no permite esta operación
 *               cause: Verificá el estado actual de la entrega
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega con el identificador proporcionado
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
 *               cause: No se pudo iniciar la entrega
 */
router.patch("/:id/start", deliveryController.startDelivery);



/**
 * @swagger
 * /api/deliveries/{id}/proofs:
 *   post:
 *     summary: Subir comprobantes de una entrega
 *     description: Permite cargar hasta 5 comprobantes por entrega. Se aceptan archivos PDF, JPG, JPEG y PNG de hasta 5 MB cada uno.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - proof
 *             properties:
 *               proof:
 *                 type: array
 *                 maxItems: 5
 *                 description: Comprobantes de la entrega (máximo 5 archivos)
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Comprobantes cargados correctamente
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
 *                   example: Comprobantes cargados correctamente
 *                 payload:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order:
 *                       type: string
 *                     driver:
 *                       type: string
 *                     status:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     proofs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           originalName:
 *                             type: string
 *                             example: comprobante.pdf
 *                           filename:
 *                             type: string
 *                             example: 1730000000000-a1b2c3d4.pdf
 *                           path:
 *                             type: string
 *                             example: uploads/deliveries/proofs/1730000000000-a1b2c3d4.pdf
 *                           mimetype:
 *                             type: string
 *                             example: application/pdf
 *                           size:
 *                             type: number
 *                             example: 245678
 *                           uploadedAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Error de validación de la carga
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   enum:
 *                     - FILE_REQUIRED
 *                     - INVALID_FILE_TYPE
 *                     - INVALID_FILE_FIELD
 *                   example: FILE_REQUIRED
 *                 message:
 *                   type: string
 *                   example: El archivo es obligatorio
 *                 cause:
 *                   type: string
 *                   example: No se proporcionó información adicional
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: DELIVERY_NOT_FOUND
 *                 message:
 *                   type: string
 *                   example: Delivery no encontrado
 *                 cause:
 *                   type: string
 *                   example: No se proporcionó información adicional
 *       413:
 *         description: Archivo demasiado grande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: FILE_TOO_LARGE
 *                 message:
 *                   type: string
 *                   example: El archivo supera el tamaño máximo permitido
 *                 cause:
 *                   type: string
 *                   example: No se proporcionó información adicional
 *       500:
 *         description: Error interno durante la carga
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: FILE_UPLOAD_ERROR
 *                 message:
 *                   type: string
 *                   example: Error al guardar el archivo
 *                 cause:
 *                   type: string
 *                   example: No se proporcionó información adicional
 */

/**
 * @swagger
 * /api/deliveries/{id}/complete:
 *   patch:
 *     summary: Completar una entrega
 *     description: Marca una entrega como completada.
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Entrega completada correctamente
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
 *                   example: Entrega completada correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: El estado actual no permite completar la entrega
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_INVALID_STATUS
 *               message: El estado actual de la entrega no permite esta operación
 *               cause: Verificá el estado actual de la entrega
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega con el identificador proporcionado
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
 *               cause: No se pudo completar la entrega
 */
router.patch("/:id/complete", deliveryController.completeDelivery);

/**
 * @swagger
 * /api/deliveries/{id}/priority:
 *   patch:
 *     summary: Actualizar prioridad de una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeliveryPriorityInput'
 *     responses:
 *       200:
 *         description: Prioridad actualizada correctamente
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
 *                   example: Prioridad actualizada correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Prioridad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_INVALID_DATA
 *               message: Datos de entrega inválidos
 *               cause: La prioridad debe ser low, normal o high
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega con el identificador proporcionado
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
 *               cause: No se pudo actualizar la prioridad
 */
router.patch("/:id/priority", deliveryController.updatePriority);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     summary: Eliminar una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador de la entrega
 *         schema:
 *           type: string
 *           example: 671a12345678901234567890
 *     responses:
 *       200:
 *         description: Entrega eliminada correctamente
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
 *                   example: Entrega eliminada correctamente
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
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: DELIVERY_NOT_FOUND
 *               message: Delivery no encontrado
 *               cause: No existe una entrega con el identificador proporcionado
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
 *               cause: No se pudo eliminar la entrega
 */
router.delete("/:id", deliveryController.delete);

export default router;