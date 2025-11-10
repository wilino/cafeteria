/**
 * Menu Service
 * Business logic for menu management
 */

const menuRepository = require('./menu.repository');
const ingredientesRepository = require('../ingredientes/ingredientes.repository');
const { isValidInteger, isValidDecimal } = require('../../shared/utils/validation.util');
const ValidationError = require('../../shared/errors/ValidationError');
const NotFoundError = require('../../shared/errors/NotFoundError');
const logger = require('../../shared/utils/logger.util');

class MenuService {
  async getAllMenuItems(availableOnly = false) {
    if (availableOnly) {
      return await menuRepository.findAvailable();
    }
    return await menuRepository.findAll();
  }

  async getMenuItemById(id) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid menu item ID');
    }

    const menuItem = await menuRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    // Get ingredients
    const ingredientes = await menuRepository.getIngredientes(id);
    menuItem.ingredientes = ingredientes;

    return menuItem;
  }

  async createMenuItem(menuData) {
    const { nombre, descripcion, precio, disponible, categoria } = menuData;

    if (!nombre || !precio) {
      throw new ValidationError('Missing required fields: nombre, precio');
    }

    if (!isValidDecimal(precio) || parseFloat(precio) < 0) {
      throw new ValidationError('Invalid precio');
    }

    const existingItem = await menuRepository.findByName(nombre);
    if (existingItem) {
      throw new ValidationError('Menu item with this name already exists');
    }

    const menuId = await menuRepository.create({
      nombre,
      descripcion: descripcion || '',
      precio: parseFloat(precio),
      disponible: disponible !== false,
      categoria: categoria || 'General',
    });

    logger.info('Menu item created', { menuId });

    return await this.getMenuItemById(menuId);
  }

  async updateMenuItem(id, menuData) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid menu item ID');
    }

    const menuItem = await menuRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    const updateData = {};

    if (menuData.nombre) {
      const existingItem = await menuRepository.findByName(menuData.nombre);
      if (existingItem && existingItem.id !== id) {
        throw new ValidationError('Menu item name already in use');
      }
      updateData.nombre = menuData.nombre;
    }

    if (menuData.descripcion !== undefined) {
      updateData.descripcion = menuData.descripcion;
    }

    if (menuData.precio !== undefined) {
      if (!isValidDecimal(menuData.precio) || parseFloat(menuData.precio) < 0) {
        throw new ValidationError('Invalid precio');
      }
      updateData.precio = parseFloat(menuData.precio);
    }

    if (menuData.disponible !== undefined) {
      updateData.disponible = menuData.disponible;
    }

    if (menuData.categoria !== undefined) {
      updateData.categoria = menuData.categoria;
    }

    const updated = await menuRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update menu item');
    }

    logger.info('Menu item updated', { menuId: id });

    return await this.getMenuItemById(id);
  }

  async deleteMenuItem(id) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid menu item ID');
    }

    const menuItem = await menuRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    const deleted = await menuRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete menu item');
    }

    logger.info('Menu item deleted', { menuId: id });
  }

  async addIngrediente(menuId, ingredienteId, cantidad) {
    if (!isValidInteger(menuId) || !isValidInteger(ingredienteId)) {
      throw new ValidationError('Invalid menu or ingrediente ID');
    }

    if (!isValidDecimal(cantidad) || parseFloat(cantidad) <= 0) {
      throw new ValidationError('Invalid cantidad');
    }

    const menuItem = await menuRepository.findById(menuId);
    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    const ingrediente = await ingredientesRepository.findById(ingredienteId);
    if (!ingrediente) {
      throw new NotFoundError('Ingrediente not found');
    }

    await menuRepository.addIngrediente(menuId, ingredienteId, parseFloat(cantidad));

    logger.info('Ingrediente added to menu item', { menuId, ingredienteId, cantidad });

    return await this.getMenuItemById(menuId);
  }

  async removeIngrediente(menuId, ingredienteId) {
    if (!isValidInteger(menuId) || !isValidInteger(ingredienteId)) {
      throw new ValidationError('Invalid menu or ingrediente ID');
    }

    const removed = await menuRepository.removeIngrediente(menuId, ingredienteId);
    if (!removed) {
      throw new NotFoundError('Ingrediente not found in menu item');
    }

    logger.info('Ingrediente removed from menu item', { menuId, ingredienteId });

    return await this.getMenuItemById(menuId);
  }
}

module.exports = new MenuService();
