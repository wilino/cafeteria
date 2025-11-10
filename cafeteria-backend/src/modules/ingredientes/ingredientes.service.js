/**
 * Ingredientes Service
 * Business logic for ingredientes management
 */

const ingredientesRepository = require('./ingredientes.repository');
const { isValidInteger, isValidDecimal } = require('../../shared/utils/validation.util');
const ValidationError = require('../../shared/errors/ValidationError');
const NotFoundError = require('../../shared/errors/NotFoundError');
const logger = require('../../shared/utils/logger.util');

class IngredientesService {
  /**
   * Get all ingredientes
   * @returns {Promise<array>} List of ingredientes
   */
  async getAllIngredientes() {
    return await ingredientesRepository.findAll();
  }

  /**
   * Get ingrediente by ID
   * @param {number} id - Ingrediente ID
   * @returns {Promise<object>} Ingrediente object
   */
  async getIngredienteById(id) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid ingrediente ID');
    }

    const ingrediente = await ingredientesRepository.findById(id);
    if (!ingrediente) {
      throw new NotFoundError('Ingrediente not found');
    }

    return ingrediente;
  }

  /**
   * Create new ingrediente
   * @param {object} ingredienteData - Ingrediente data
   * @returns {Promise<object>} Created ingrediente
   */
  async createIngrediente(ingredienteData) {
    const { nombre, unidad, stock, stockMinimo } = ingredienteData;

    // Validate input
    if (!nombre || !unidad) {
      throw new ValidationError('Missing required fields: nombre, unidad');
    }

    if (stock !== undefined && !isValidDecimal(stock)) {
      throw new ValidationError('Invalid stock');
    }

    if (stockMinimo !== undefined && !isValidDecimal(stockMinimo)) {
      throw new ValidationError('Invalid stockMinimo');
    }

    // Check if ingrediente already exists
    const existingIngrediente = await ingredientesRepository.findByName(nombre);
    if (existingIngrediente) {
      throw new ValidationError('Ingrediente with this name already exists');
    }

    // Create ingrediente
    const ingredienteId = await ingredientesRepository.create({
      nombre,
      unidad,
      stock: stock || 0,
      stockMinimo: stockMinimo || 0,
    });

    logger.info('Ingrediente created', { ingredienteId });

    return await this.getIngredienteById(ingredienteId);
  }

  /**
   * Update ingrediente
   * @param {number} id - Ingrediente ID
   * @param {object} ingredienteData - Ingrediente data to update
   * @returns {Promise<object>} Updated ingrediente
   */
  async updateIngrediente(id, ingredienteData) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid ingrediente ID');
    }

    const ingrediente = await ingredientesRepository.findById(id);
    if (!ingrediente) {
      throw new NotFoundError('Ingrediente not found');
    }

    const updateData = {};

    if (ingredienteData.nombre) {
      // Check if new name is already in use by another ingrediente
      const existingIngrediente = await ingredientesRepository.findByName(ingredienteData.nombre);
      if (existingIngrediente && existingIngrediente.id !== id) {
        throw new ValidationError('Ingrediente name already in use');
      }
      updateData.nombre = ingredienteData.nombre;
    }

    if (ingredienteData.unidadMedida) {
      updateData.unidadMedida = ingredienteData.unidadMedida;
    }

    if (ingredienteData.cantidadDisponible !== undefined) {
      if (!isValidDecimal(ingredienteData.cantidadDisponible)) {
        throw new ValidationError('Invalid cantidadDisponible');
      }
      updateData.cantidadDisponible = parseFloat(ingredienteData.cantidadDisponible);
    }

    if (ingredienteData.cantidadMinima !== undefined) {
      if (!isValidDecimal(ingredienteData.cantidadMinima)) {
        throw new ValidationError('Invalid cantidadMinima');
      }
      updateData.cantidadMinima = parseFloat(ingredienteData.cantidadMinima);
    }

    const updated = await ingredientesRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update ingrediente');
    }

    logger.info('Ingrediente updated', { ingredienteId: id });

    return await this.getIngredienteById(id);
  }

  /**
   * Delete ingrediente
   * @param {number} id - Ingrediente ID
   * @returns {Promise<void>}
   */
  async deleteIngrediente(id) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid ingrediente ID');
    }

    const ingrediente = await ingredientesRepository.findById(id);
    if (!ingrediente) {
      throw new NotFoundError('Ingrediente not found');
    }

    const deleted = await ingredientesRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete ingrediente');
    }

    logger.info('Ingrediente deleted', { ingredienteId: id });
  }

  /**
   * Get ingredientes with low stock
   * @returns {Promise<array>} List of ingredientes with low stock
   */
  async getLowStock() {
    return await ingredientesRepository.findLowStock();
  }

  /**
   * Update ingrediente stock
   * @param {number} id - Ingrediente ID
   * @param {number} cantidad - Quantity to add (positive) or subtract (negative)
   * @returns {Promise<object>} Updated ingrediente
   */
  async updateStock(id, cantidad) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid ingrediente ID');
    }

    if (!isValidDecimal(cantidad)) {
      throw new ValidationError('Invalid cantidad');
    }

    const ingrediente = await ingredientesRepository.findById(id);
    if (!ingrediente) {
      throw new NotFoundError('Ingrediente not found');
    }

    // Check if stock would be negative
    const newStock = parseFloat(ingrediente.cantidad_disponible) + parseFloat(cantidad);
    if (newStock < 0) {
      throw new ValidationError('Insufficient stock');
    }

    const updated = await ingredientesRepository.updateStock(id, cantidad);
    if (!updated) {
      throw new Error('Failed to update stock');
    }

    logger.info('Stock updated', {
      ingredienteId: id,
      cantidad,
      newStock,
    });

    return await this.getIngredienteById(id);
  }
}

module.exports = new IngredientesService();
