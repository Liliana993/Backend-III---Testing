
import { Router } from "express";
import productController from "../controllers/producto.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Gestión y consulta de productos
 */


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos paginados con filtros opcionales
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filtrar por estado del producto.
 *         schema:
 *           type: string
 *           enum: [available, out_of_stock, discontinued]
 *       - in: query
 *         name: minPrice
 *         required: false
 *         description: Precio mínimo.
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: Precio máximo.
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: inStock
 *         required: false
 *         description: Filtrar por disponibilidad de stock.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         required: false
 *         description: Número de página (por defecto 1).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Cantidad de productos por página (por defecto 10, máximo 100).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
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
 *                     $ref: '#/components/schemas/Product'
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
 *             example:
 *               status: success
 *               payload: []
 *               pagination:
 *                 total: 0
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 0
 *       400:
 *         description: Parámetros de paginación inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Los parámetros page y limit deben ser enteros positivos. El límite máximo es 100.
 *               cause: 400
 *       500:
 *         description: Error interno al obtener los productos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.get("/", productController.getAll);


/**
 * @swagger
 * /api/products/name/{name}:
 *   get:
 *     summary: Buscar un producto por nombre
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Nombre del producto.
 *         schema:
 *           type: string
 *         example: Notebook
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: PRODUCT_NOT_FOUND
 *               message: Producto no encontrado
 *               cause: No existe un producto con el nombre proporcionado
 *       500:
 *         description: Error interno durante la búsqueda.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.get("/name/:name", productController.getByName);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: El identificador proporcionado no es válido
 *               cause: El valor proporcionado no tiene un formato válido
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: PRODUCT_NOT_FOUND
 *               message: Producto no encontrado
 *               cause: No existe un producto con el ID proporcionado
 *       500:
 *         description: Error interno durante la búsqueda.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.get("/:id", productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un producto
 *     description: El estado se calcula automáticamente según el stock.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateInput'
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
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
 *                   example: Producto creado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de producto inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Error de validación
 *               cause: Los datos del producto no son válidos
 *       500:
 *         description: Error interno al crear el producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.post("/", productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: El estado se recalcula automáticamente según el stock resultante.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
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
 *                   example: Producto actualizado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos o identificador inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Error de validación
 *               cause: Los datos o el identificador proporcionados no son válidos
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: PRODUCT_NOT_FOUND
 *               message: Producto no encontrado
 *               cause: No existe un producto con el ID proporcionado
 *       500:
 *         description: Error interno al actualizar el producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.put("/:id", productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del producto.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: success
 *               message: Producto eliminado correctamente
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: El identificador proporcionado no es válido
 *               cause: El valor proporcionado no tiene un formato válido
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: PRODUCT_NOT_FOUND
 *               message: Producto no encontrado
 *               cause: No existe un producto con el ID proporcionado
 *       500:
 *         description: Error interno al eliminar el producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: INTERNAL_SERVER_ERROR
 *               message: Error interno del servidor
 *               cause: Se produjo un error inesperado
 */
router.delete("/:id", productController.delete);

export default router;