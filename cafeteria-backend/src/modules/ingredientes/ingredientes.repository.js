/**
 * Ingredientes Repository
 * Data access layer for ingredientes management
 */

const pool = require('../../config/database.config');

class IngredientesRepository {
  /**
   * Get all ingredientes
   * @returns {Promise<array>} List of ingredientes
   */
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM ingredientes ORDER BY nombre ASC'
    );
    return rows;
  }

  /**
   * Find ingrediente by ID
   * @param {number} id - Ingrediente ID
   * @returns {Promise<object|null>} Ingrediente object or null
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM ingredientes WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Find ingrediente by name
   * @param {string} nombre - Ingrediente name
   * @returns {Promise<object|null>} Ingrediente object or null
   */
  async findByName(nombre) {
    const [rows] = await pool.execute(
      'SELECT * FROM ingredientes WHERE nombre = ?',
      [nombre]
    );
    return rows[0] || null;
  }

  /**
   * Create new ingrediente
   * @param {object} ingredienteData - Ingrediente data
   * @returns {Promise<number>} Inserted ingrediente ID
   */
  async create(ingredienteData) {
    const { nombre, unidad, stock, stockMinimo } = ingredienteData;
    const [result] = await pool.execute(
      'INSERT INTO ingredientes (nombre, unidad, stock, stock_minimo) VALUES (?, ?, ?, ?)',
      [nombre, unidad, stock, stockMinimo]
    );
    return result.insertId;
  }

  /**
   * Update ingrediente
   * @param {number} id - Ingrediente ID
   * @param {object} ingredienteData - Ingrediente data to update
   * @returns {Promise<boolean>} True if updated
   */
  async update(id, ingredienteData) {
    const fields = [];
    const values = [];

    if (ingredienteData.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(ingredienteData.nombre);
    }
    if (ingredienteData.unidadMedida !== undefined) {
      fields.push('unidad_medida = ?');
      values.push(ingredienteData.unidadMedida);
    }
    if (ingredienteData.cantidadDisponible !== undefined) {
      fields.push('cantidad_disponible = ?');
      values.push(ingredienteData.cantidadDisponible);
    }
    if (ingredienteData.cantidadMinima !== undefined) {
      fields.push('cantidad_minima = ?');
      values.push(ingredienteData.cantidadMinima);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE ingredientes SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete ingrediente
   * @param {number} id - Ingrediente ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM ingredientes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Get ingredientes with low stock
   * @returns {Promise<array>} List of ingredientes with low stock
   */
  async findLowStock() {
    const [rows] = await pool.execute(
      'SELECT * FROM ingredientes WHERE stock <= stock_minimo ORDER BY stock ASC'
    );
    return rows;
  }

  /**
   * Update ingrediente stock
   * @param {number} id - Ingrediente ID
   * @param {number} cantidad - Quantity to add (positive) or subtract (negative)
   * @returns {Promise<boolean>} True if updated
   */
  async updateStock(id, cantidad) {
    const [result] = await pool.execute(
      'UPDATE ingredientes SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [cantidad, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new IngredientesRepository();
