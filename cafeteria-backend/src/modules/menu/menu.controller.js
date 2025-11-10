/**
 * Menu Controller
 */

const menuService = require('./menu.service');

class MenuController {
  async getAllMenuItems(req, res, next) {
    try {
      const availableOnly = req.query.available === 'true';
      const menuItems = await menuService.getAllMenuItems(availableOnly);

      res.status(200).json({
        success: true,
        data: menuItems,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenuItemById(req, res, next) {
    try {
      const menuItem = await menuService.getMenuItemById(req.params.id);

      res.status(200).json({
        success: true,
        data: menuItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMenuItem(req, res, next) {
    try {
      const menuItem = await menuService.createMenuItem(req.body);

      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: menuItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const menuItem = await menuService.updateMenuItem(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        data: menuItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuItem(req, res, next) {
    try {
      await menuService.deleteMenuItem(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async addIngrediente(req, res, next) {
    try {
      const { ingredienteId, cantidad } = req.body;
      const menuItem = await menuService.addIngrediente(req.params.id, ingredienteId, cantidad);

      res.status(200).json({
        success: true,
        message: 'Ingrediente added successfully',
        data: menuItem,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeIngrediente(req, res, next) {
    try {
      const menuItem = await menuService.removeIngrediente(req.params.id, req.params.ingredienteId);

      res.status(200).json({
        success: true,
        message: 'Ingrediente removed successfully',
        data: menuItem,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MenuController();
