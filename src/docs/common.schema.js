
/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       description: Respuesta estándar de una operación exitosa.
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Operación realizada correctamente
 *
 *     ErrorResponse:
 *       type: object
 *       description: Respuesta estándar de error de la API.
 *       required:
 *         - status
 *         - error
 *         - message
 *         - cause
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         error:
 *           type: string
 *           example: VALIDATION_ERROR
 *         message:
 *           type: string
 *           example: Error de validación
 *         cause:
 *           type: string
 *           example: Los datos proporcionados no son válidos
 */