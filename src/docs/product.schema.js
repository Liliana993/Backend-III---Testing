

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "671a2bc123456789abcdef01"
 *         name:
 *           type: string
 *           example: Notebook
 *         description:
 *           type: string
 *           example: Notebook para uso profesional
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 850000
 *         stock:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 5
 *         status:
 *           type: string
 *           enum: [available, out_of_stock, discontinued]
 *           example: available
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-28T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-10-28T12:00:00.000Z"
 *
 *     ProductCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           example: Notebook
 *         description:
 *           type: string
 *           example: Notebook para uso profesional
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 850000
 *         stock:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 5
 *
 *     ProductUpdateInput:
 *       type: object
 *       description: Todos los campos son opcionales. El estado se recalcula según el stock.
 *       properties:
 *         name:
 *           type: string
 *           example: Notebook actualizada
 *         description:
 *           type: string
 *           example: Notebook con nuevas características
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 820000
 *         stock:
 *           type: number
 *           minimum: 0
 *           example: 8
 */
