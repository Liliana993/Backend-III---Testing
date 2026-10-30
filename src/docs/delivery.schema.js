
/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       description: Entrega gestionada por ShipNow.
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a12345678901234567890"
 *         order:
 *           type: string
 *           description: ID del pedido asociado.
 *           example: "671a12345678901234567891"
 *         driver:
 *           type: string
 *           nullable: true
 *           description: ID del repartidor asignado.
 *           example: "671a12345678901234567892"
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - assigned
 *             - in_transit
 *             - delivered
 *           example: pending
 *         priority:
 *           type: string
 *           enum:
 *             - low
 *             - normal
 *             - high
 *           example: normal
 *         assignedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-10-29T12:30:00.000Z"
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     DeliveryCreateInput:
 *       type: object
 *       description: Datos para crear una entrega.
 *       required:
 *         - order
 *       properties:
 *         order:
 *           type: string
 *           description: ID del pedido asociado.
 *           example: "671a12345678901234567891"
 *         priority:
 *           type: string
 *           enum:
 *             - low
 *             - normal
 *             - high
 *           default: normal
 *
 *     AssignDriverInput:
 *       type: object
 *       required:
 *         - driverId
 *       properties:
 *         driverId:
 *           type: string
 *           description: ID del repartidor.
 *           example: "671a12345678901234567892"
 *
 *     UpdateDeliveryPriorityInput:
 *       type: object
 *       required:
 *         - priority
 *       properties:
 *         priority:
 *           type: string
 *           enum:
 *             - low
 *             - normal
 *             - high
 *           example: high
 */
