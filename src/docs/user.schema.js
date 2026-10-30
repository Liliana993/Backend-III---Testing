
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Usuario registrado en ShipNow.
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador del usuario.
 *           example: "671a2b3c4d5e6f7890123456"
 *         firstName:
 *           type: string
 *           description: Nombre del usuario.
 *           example: "Juan"
 *         lastName:
 *           type: string
 *           description: Apellido del usuario.
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico normalizado a minúsculas.
 *           example: "juan@example.com"
 *         role:
 *           type: string
 *           description: Rol asignado al usuario.
 *           example: "customer"
 *         documents:
 *           type: array
 *           description: Documentos asociados al usuario.
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "DNI"
 *               reference:
 *                 type: string
 *                 example: "documents/dni-juan.pdf"
 *         isAvailable:
 *           type: boolean
 *           description: Indica si el usuario está disponible.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización.
 *
 *     UserCreateInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Juan"
 *         lastName:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña que se almacena cifrada mediante bcrypt.
 *           example: "MiPassword123"
 *         role:
 *           type: string
 *           description: Rol del usuario. Si se omite, se aplica el rol predeterminado.
 *           example: "customer"
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               reference:
 *                 type: string
 *         isAvailable:
 *           type: boolean
 *           description: Si se omite, el valor predeterminado es true.
 *
 *     UserUpdateInput:
 *       type: object
 *       description: Campos que se pueden enviar para actualizar un usuario.
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Juan"
 *         lastName:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan.nuevo@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Nueva contraseña, si se permite actualizarla desde el repositorio.
 *         role:
 *           type: string
 *           example: "customer"
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               reference:
 *                 type: string
 *         isAvailable:
 *           type: boolean
 */