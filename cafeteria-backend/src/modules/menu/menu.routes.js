/**
 * Menu Routes
 */

const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');
const authenticate = require('../../middlewares/auth.middleware');
const { requirePermission, auditLog } = require('../../middlewares/permission.middleware');

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by available items only
 *     responses:
 *       200:
 *         description: Menu items retrieved successfully
 */
router.get('/', menuController.getAllMenuItems.bind(menuController));

router.get('/:id', menuController.getMenuItemById.bind(menuController));

router.post('/', authenticate, requirePermission('menu.create'), auditLog('CREATE_MENU_ITEM', 'menu'), menuController.createMenuItem.bind(menuController));

router.put('/:id', authenticate, requirePermission('menu.update'), auditLog('UPDATE_MENU_ITEM', 'menu'), menuController.updateMenuItem.bind(menuController));

router.delete('/:id', authenticate, requirePermission('menu.delete'), auditLog('DELETE_MENU_ITEM', 'menu'), menuController.deleteMenuItem.bind(menuController));

router.post('/:id/ingredientes', authenticate, requirePermission('menu.manage_ingredientes'), menuController.addIngrediente.bind(menuController));

router.delete('/:id/ingredientes/:ingredienteId', authenticate, requirePermission('menu.manage_ingredientes'), menuController.removeIngrediente.bind(menuController));

module.exports = router;
