import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
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
 *                     $ref: '#/components/schemas/User'
 *             example:
 *               status: success
 *               payload: []
 *       500:
 *         description: Error interno del servidor.
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
router.get("/", userController.getAll);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Obtener usuario por email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Correo electrónico del usuario.
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un usuario con el email proporcionado
 *       500:
 *         description: Error interno del servidor.
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
router.get("/email/:email", userController.getByEmail);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/User'
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor.
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
router.get("/:id", userController.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateInput'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
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
 *                   example: Usuario creado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de usuario inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: VALIDATION_ERROR
 *               message: Error de validación
 *               cause: Los datos proporcionados no son válidos
 *       500:
 *         description: Error interno del servidor.
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
router.post("/", userController.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del usuario.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
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
 *                   example: Usuario actualizado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/User'
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor.
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
router.put("/:id", userController.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: success
 *               message: Usuario eliminado correctamente
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: USER_NOT_FOUND
 *               message: Usuario no encontrado
 *               cause: No existe un usuario con el ID proporcionado
 *       500:
 *         description: Error interno del servidor.
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
router.delete("/:id", userController.delete);

export default router;