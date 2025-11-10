/**
 * Pedidos Repository
 */

const pool = require('../../config/database.config');

class PedidosRepository {
  async findAll(limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.nombre as cliente_nombre 
       FROM pedidos p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM pedidos');
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, u.nombre as cliente_nombre, u.email as cliente_email
       FROM pedidos p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findByCliente(clienteId, limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT * FROM pedidos 
       WHERE user_id = ? 
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [clienteId, limit, offset]
    );
    return rows;
  }

  async create(pedidoData) {
    const { clienteId, estado, total } = pedidoData;
    const [result] = await pool.execute(
      'INSERT INTO pedidos (user_id, estado, total) VALUES (?, ?, ?)',
      [clienteId, estado || 'pendiente', total || 0]
    );
    return result.insertId;
  }

  async update(id, pedidoData) {
    const fields = [];
    const values = [];

    if (pedidoData.estado !== undefined) {
      fields.push('estado = ?');
      values.push(pedidoData.estado);
    }
    if (pedidoData.total !== undefined) {
      fields.push('total = ?');
      values.push(pedidoData.total);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE pedidos SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM pedidos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async getItems(pedidoId) {
    const [rows] = await pool.execute(
      `SELECT pi.*, m.nombre as menu_nombre, m.descripcion, m.precio
       FROM pedido_items pi
       JOIN menu m ON pi.menu_id = m.id
       WHERE pi.pedido_id = ?`,
      [pedidoId]
    );
    return rows;
  }

  async addItem(pedidoId, menuId, cantidad, precioUnitario) {
    const subtotal = cantidad * precioUnitario;
    await pool.execute(
      'INSERT INTO pedido_items (pedido_id, menu_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [pedidoId, menuId, cantidad, precioUnitario, subtotal]
    );
  }

  async removeItem(pedidoId, menuId) {
    const [result] = await pool.execute(
      'DELETE FROM pedido_items WHERE pedido_id = ? AND menu_id = ?',
      [pedidoId, menuId]
    );
    return result.affectedRows > 0;
  }

  async clearItems(pedidoId) {
    await pool.execute('DELETE FROM pedido_items WHERE pedido_id = ?', [pedidoId]);
  }
}

module.exports = new PedidosRepository();
