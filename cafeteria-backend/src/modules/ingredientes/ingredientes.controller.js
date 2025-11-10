/**
 * Ingredientes Controller
 * Handles HTTP requests for ingredientes management
 */

const ingredientesService = require('./ingredientes.service');

class IngredientesController {
  /**
   * Get all ingredientes
   * GET /api/ingredientes
   */
  async getAllIngredientes(req, res, next) {
    try {
      const ingredientes = await ingredientesService.getAllIngredientes();

      res.status(200).json({
        success: true,
        data: ingredientes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ingrediente by ID
   * GET /api/ingredientes/:id
   */
  async getIngredienteById(req, res, next) {
    try {
      const ingrediente = await ingredientesService.getIngredienteById(req.params.id);

      res.status(200).json({
        success: true,
        data: ingrediente,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new ingrediente
   * POST /api/ingredientes
   */
  async createIngrediente(req, res, next) {
    try {
      const ingrediente = await ingredientesService.createIngrediente(req.body);

      res.status(201).json({
        success: true,
        message: 'Ingrediente created successfully',
        data: ingrediente,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ingrediente
   * PUT /api/ingredientes/:id
   */
  async updateIngrediente(req, res, next) {
    try {
      const ingrediente = await ingredientesService.updateIngrediente(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Ingrediente updated successfully',
        data: ingrediente,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete ingrediente
   * DELETE /api/ingredientes/:id
   */
  async deleteIngrediente(req, res, next) {
    try {
      await ingredientesService.deleteIngrediente(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Ingrediente deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ingredientes with low stock
   * GET /api/ingredientes/low-stock
   */
  async getLowStock(req, res, next) {
    try {
      const ingredientes = await ingredientesService.getLowStock();

      res.status(200).json({
        success: true,
        data: ingredientes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ingrediente stock
   * PATCH /api/ingredientes/:id/stock
   */
  async updateStock(req, res, next) {
    try {
      const { cantidad } = req.body;
      const ingrediente = await ingredientesService.updateStock(req.params.id, cantidad);

      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: ingrediente,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IngredientesController();
