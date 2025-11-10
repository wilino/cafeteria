/**
 * Pedidos Service
 */

const pedidosRepository = require('./pedidos.repository');
const menuRepository = require('../menu/menu.repository');
const ingredientesRepository = require('../ingredientes/ingredientes.repository');
const { isValidInteger, isValidDecimal } = require('../../shared/utils/validation.util');
const ValidationError = require('../../shared/errors/ValidationError');
const NotFoundError = require('../../shared/errors/NotFoundError');
const AuthorizationError = require('../../shared/errors/AuthorizationError');
const logger = require('../../shared/utils/logger.util');
const pool = require('../../config/database.config');

class PedidosService {
  async getAllPedidos(page = 1, limit = 50, requestingUser) {
    const offset = (page - 1) * limit;
    let pedidos;
    let total;

    if (requestingUser.role === 'cliente') {
      pedidos = await pedidosRepository.findByCliente(requestingUser.id, limit, offset);
      total = pedidos.length;
    } else {
      pedidos = await pedidosRepository.findAll(limit, offset);
      total = await pedidosRepository.count();
    }

    return {
      pedidos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPedidoById(id, requestingUser) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid pedido ID');
    }

    const pedido = await pedidosRepository.findById(id);
    if (!pedido) {
      throw new NotFoundError('Pedido not found');
    }

    // Clientes can only see their own pedidos
    if (requestingUser.role === 'cliente' && pedido.cliente_id !== requestingUser.id) {
      throw new AuthorizationError('Cannot access this pedido');
    }

    const items = await pedidosRepository.getItems(id);
    pedido.items = items;

    return pedido;
  }

  async createPedido(pedidoData, requestingUser) {
    const { items } = pedidoData;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Pedido must have at least one item');
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create pedido
      const pedidoId = await pedidosRepository.create({
        clienteId: requestingUser.id,
        estado: 'pendiente',
        total: 0,
      });

      let total = 0;

      // Process each item
      for (const item of items) {
        const { menuId, cantidad } = item;

        if (!isValidInteger(menuId) || !isValidInteger(cantidad) || cantidad <= 0) {
          throw new ValidationError('Invalid item data');
        }

        // Get menu item
        const menuItem = await menuRepository.findById(menuId);
        if (!menuItem) {
          throw new NotFoundError(`Menu item ${menuId} not found`);
        }

        if (!menuItem.disponible) {
          throw new ValidationError(`Menu item "${menuItem.nombre}" is not available`);
        }

        // Check ingredientes availability
        const ingredientes = await menuRepository.getIngredientes(menuId);
        for (const ing of ingredientes) {
          const requiredQty = ing.cantidad_requerida * cantidad;
          if (ing.cantidad_disponible < requiredQty) {
            throw new ValidationError(`Insufficient stock for "${menuItem.nombre}"`);
          }
        }

        // Add item to pedido
        const subtotal = parseFloat(menuItem.precio) * cantidad;
        await pedidosRepository.addItem(pedidoId, menuId, cantidad, menuItem.precio);
        total += subtotal;

        // Deduct ingredientes
        for (const ing of ingredientes) {
          const requiredQty = ing.cantidad_requerida * cantidad;
          await ingredientesRepository.updateStock(ing.ingrediente_id, -requiredQty);
        }
      }

      // Update total
      await pedidosRepository.update(pedidoId, { total });

      await connection.commit();
      connection.release();

      logger.info('Pedido created', { pedidoId, clienteId: requestingUser.id, total });

      return await this.getPedidoById(pedidoId, requestingUser);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  async updatePedidoEstado(id, estado, requestingUser) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid pedido ID');
    }

    const validEstados = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];
    if (!validEstados.includes(estado)) {
      throw new ValidationError('Invalid estado');
    }

    const pedido = await pedidosRepository.findById(id);
    if (!pedido) {
      throw new NotFoundError('Pedido not found');
    }

    const updated = await pedidosRepository.update(id, { estado });
    if (!updated) {
      throw new Error('Failed to update pedido');
    }

    logger.info('Pedido estado updated', { pedidoId: id, estado });

    return await this.getPedidoById(id, requestingUser);
  }

  async cancelPedido(id, requestingUser) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid pedido ID');
    }

    const pedido = await pedidosRepository.findById(id);
    if (!pedido) {
      throw new NotFoundError('Pedido not found');
    }

    // Clientes can only cancel their own pending pedidos
    if (requestingUser.role === 'cliente') {
      if (pedido.cliente_id !== requestingUser.id) {
        throw new AuthorizationError('Cannot cancel this pedido');
      }
      if (pedido.estado !== 'pendiente') {
        throw new ValidationError('Can only cancel pending pedidos');
      }
    }

    // Restore ingredientes stock
    const items = await pedidosRepository.getItems(id);
    for (const item of items) {
      const ingredientes = await menuRepository.getIngredientes(item.menu_id);
      for (const ing of ingredientes) {
        const qty = ing.cantidad_requerida * item.cantidad;
        await ingredientesRepository.updateStock(ing.ingrediente_id, qty);
      }
    }

    await pedidosRepository.update(id, { estado: 'cancelado' });

    logger.info('Pedido cancelled', { pedidoId: id });

    return await this.getPedidoById(id, requestingUser);
  }
}

module.exports = new PedidosService();
