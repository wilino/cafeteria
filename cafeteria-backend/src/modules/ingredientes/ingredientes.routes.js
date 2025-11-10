/**
 * Ingredientes Routes
 * Defines routes for ingredientes management endpoints with fine-grained permissions
 */

const express = require('express');
const router = express.Router();
const ingredientesController = require('./ingredientes.controller');
const authenticate = require('../../middlewares/auth.middleware');
const { requirePermission, auditLog } = require('../../middlewares/permission.middleware');

/**
 * @swagger
 * /api/ingredientes/low-stock:
 *   get:
 *     summary: Get ingredientes with low stock
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock ingredientes retrieved successfully
 */
router.get('/low-stock', authenticate, requirePermission('ingredientes.read'), ingredientesController.getLowStock.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes:
 *   get:
 *     summary: Get all ingredientes
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ingredientes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ingrediente'
 */
router.get('/', authenticate, requirePermission('ingredientes.read'), ingredientesController.getAllIngredientes.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes/{id}:
 *   get:
 *     summary: Get ingrediente by ID
 *     tags: [Ingredientes]
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
 *         description: Ingrediente retrieved successfully
 */
router.get('/:id', authenticate, requirePermission('ingredientes.read'), ingredientesController.getIngredienteById.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes:
 *   post:
 *     summary: Create new ingrediente (Admin/Empleado only)
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - unidadMedida
 *             properties:
 *               nombre:
 *                 type: string
 *               unidadMedida:
 *                 type: string
 *               cantidadDisponible:
 *                 type: number
 *               cantidadMinima:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ingrediente created successfully
 */
router.post('/', authenticate, requirePermission('ingredientes.create'), auditLog('CREATE_INGREDIENTE', 'ingredientes'), ingredientesController.createIngrediente.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes/{id}:
 *   put:
 *     summary: Update ingrediente (Admin/Empleado only)
 *     tags: [Ingredientes]
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
 *             properties:
 *               nombre:
 *                 type: string
 *               unidadMedida:
 *                 type: string
 *               cantidadDisponible:
 *                 type: number
 *               cantidadMinima:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ingrediente updated successfully
 */
router.put('/:id', authenticate, requirePermission('ingredientes.update'), auditLog('UPDATE_INGREDIENTE', 'ingredientes'), ingredientesController.updateIngrediente.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes/{id}:
 *   delete:
 *     summary: Delete ingrediente (Admin only)
 *     tags: [Ingredientes]
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
 *         description: Ingrediente deleted successfully
 */
router.delete('/:id', authenticate, requirePermission('ingredientes.delete'), auditLog('DELETE_INGREDIENTE', 'ingredientes'), ingredientesController.deleteIngrediente.bind(ingredientesController));

/**
 * @swagger
 * /api/ingredientes/{id}/stock:
 *   patch:
 *     summary: Update ingrediente stock (Admin/Empleado only)
 *     tags: [Ingredientes]
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
 *               - cantidad
 *             properties:
 *               cantidad:
 *                 type: number
 *                 description: Quantity to add (positive) or subtract (negative)
 *     responses:
 *       200:
 *         description: Stock updated successfully
 */
router.patch('/:id/stock', authenticate, requirePermission('ingredientes.manage_stock'), auditLog('UPDATE_STOCK', 'ingredientes'), ingredientesController.updateStock.bind(ingredientesController));

module.exports = router;
