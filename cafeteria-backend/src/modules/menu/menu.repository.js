/**
 * Menu Repository
 * Data access layer for menu management
 */

const pool = require('../../config/database.config');

class MenuRepository {
  /**
   * Get all menu items
   * @returns {Promise<array>} List of menu items
   */
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM menu ORDER BY categoria, nombre ASC'
    );
    return rows;
  }

  /**
   * Get available menu items
   * @returns {Promise<array>} List of available menu items
   */
  async findAvailable() {
    const [rows] = await pool.execute(
      'SELECT * FROM menu WHERE disponible = 1 ORDER BY categoria, nombre ASC'
    );
    return rows;
  }

  /**
   * Find menu item by ID
   * @param {number} id - Menu item ID
   * @returns {Promise<object|null>} Menu item object or null
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Find menu item by name
   * @param {string} nombre - Menu item name
   * @returns {Promise<object|null>} Menu item object or null
   */
  async findByName(nombre) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu WHERE nombre = ?',
      [nombre]
    );
    return rows[0] || null;
  }

  /**
   * Create new menu item
   * @param {object} menuData - Menu item data
   * @returns {Promise<number>} Inserted menu item ID
   */
  async create(menuData) {
    const { nombre, descripcion, precio, disponible, categoria } = menuData;
    const [result] = await pool.execute(
      'INSERT INTO menu (nombre, descripcion, precio, disponible, categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, disponible ? 1 : 0, categoria]
    );
    return result.insertId;
  }

  /**
   * Update menu item
   * @param {number} id - Menu item ID
   * @param {object} menuData - Menu item data to update
   * @returns {Promise<boolean>} True if updated
   */
  async update(id, menuData) {
    const fields = [];
    const values = [];

    if (menuData.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(menuData.nombre);
    }
    if (menuData.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(menuData.descripcion);
    }
    if (menuData.precio !== undefined) {
      fields.push('precio = ?');
      values.push(menuData.precio);
    }
    if (menuData.disponible !== undefined) {
      fields.push('disponible = ?');
      values.push(menuData.disponible ? 1 : 0);
    }
    if (menuData.categoria !== undefined) {
      fields.push('categoria = ?');
      values.push(menuData.categoria);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE menu SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete menu item
   * @param {number} id - Menu item ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM menu WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Get menu item ingredients
   * @param {number} menuId - Menu item ID
   * @returns {Promise<array>} List of ingredients with quantities
   */
  async getIngredientes(menuId) {
    const [rows] = await pool.execute(
      `SELECT mi.*, i.nombre, i.unidad_medida, i.cantidad_disponible
       FROM menu_ingredientes mi
       JOIN ingredientes i ON mi.ingrediente_id = i.id
       WHERE mi.menu_id = ?`,
      [menuId]
    );
    return rows;
  }

  /**
   * Add ingredient to menu item
   * @param {number} menuId - Menu item ID
   * @param {number} ingredienteId - Ingredient ID
   * @param {number} cantidad - Required quantity
   * @returns {Promise<void>}
   */
  async addIngrediente(menuId, ingredienteId, cantidad) {
    await pool.execute(
      'INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_requerida) VALUES (?, ?, ?)',
      [menuId, ingredienteId, cantidad]
    );
  }

  /**
   * Remove ingredient from menu item
   * @param {number} menuId - Menu item ID
   * @param {number} ingredienteId - Ingredient ID
   * @returns {Promise<boolean>} True if removed
   */
  async removeIngrediente(menuId, ingredienteId) {
    const [result] = await pool.execute(
      'DELETE FROM menu_ingredientes WHERE menu_id = ? AND ingrediente_id = ?',
      [menuId, ingredienteId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update ingredient quantity for menu item
   * @param {number} menuId - Menu item ID
   * @param {number} ingredienteId - Ingredient ID
   * @param {number} cantidad - New quantity
   * @returns {Promise<boolean>} True if updated
   */
  async updateIngredienteCantidad(menuId, ingredienteId, cantidad) {
    const [result] = await pool.execute(
      'UPDATE menu_ingredientes SET cantidad_requerida = ? WHERE menu_id = ? AND ingrediente_id = ?',
      [cantidad, menuId, ingredienteId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new MenuRepository();
