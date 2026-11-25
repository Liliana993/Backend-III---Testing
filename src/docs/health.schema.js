/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar el estado de la API
 *     description: Devuelve el estado, entorno y tiempo de actividad del servidor.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API funcionando correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: production
 *                 uptime:
 *                   type: number
 *                   description: Tiempo de actividad del proceso en segundos.
 *                   example: 120.5
 */