
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: Teclado inalámbrico
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 1500
 *
 *     OrderCreateInput:
 *       type: object
 *       required:
 *         - customer
 *         - deliveryAddress
 *         - items
 *       properties:
 *         customer:
 *           type: string
 *           description: ID de un usuario existente
 *           example: 671a12345678901234567890
 *         deliveryAddress:
 *           type: string
 *           example: Avenida San Martín 123, Posadas
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         priority:
 *           type: string
 *           description: Prioridad de la orden
 *           example: NORMAL
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 671a12345678901234567890
 *         customer:
 *           type: string
 *           description: ID del cliente
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         deliveryAddress:
 *           type: string
 *           example: Avenida San Martín 123, Posadas
 *         declaredValue:
 *           type: number
 *           example: 3000
 *         shippingCost:
 *           type: number
 *           example: 10
 *         total:
 *           type: number
 *           example: 3010
 *         status:
 *           type: string
 *           example: created
 *         priority:
 *           type: string
 *           example: normal
 *         delivery:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
