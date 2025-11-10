/**
 * Pedidos Routes
 */

const express = require('express');
const router = express.Router();
const pedidosController = require('./pedidos.controller');
const authenticate = require('../../middlewares/auth.middleware');
const { requirePermission, auditLog } = require('../../middlewares/permission.middleware');
const idempotencyMiddleware = require('../../middlewares/idempotency.middleware');

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Get all pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedidos retrieved successfully
 */
router.get('/', authenticate, requirePermission('pedidos.read'), pedidosController.getAllPedidos.bind(pedidosController));

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Get pedido by ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido retrieved successfully
 */
router.get('/:id', authenticate, requirePermission('pedidos.read'), pedidosController.getPedidoById.bind(pedidosController));

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Create new pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuId:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido created successfully
 */
router.post('/', authenticate, idempotencyMiddleware, requirePermission('pedidos.create'), auditLog('CREATE_PEDIDO', 'pedidos'), pedidosController.createPedido.bind(pedidosController));

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     summary: Update pedido estado (Admin/Empleado only)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_preparacion, listo, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estado updated successfully
 */
router.patch('/:id/estado', authenticate, requirePermission('pedidos.manage_estado'), auditLog('UPDATE_PEDIDO_ESTADO', 'pedidos'), pedidosController.updateEstado.bind(pedidosController));

/**
 * @swagger
 * /api/pedidos/{id}/cancel:
 *   post:
 *     summary: Cancel pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelled successfully
 */
router.post('/:id/cancel', authenticate, requirePermission('pedidos.cancel'), auditLog('CANCEL_PEDIDO', 'pedidos'), pedidosController.cancelPedido.bind(pedidosController));

module.exports = router;
