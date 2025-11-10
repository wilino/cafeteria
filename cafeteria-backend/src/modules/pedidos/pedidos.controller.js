/**
 * Pedidos Controller
 */

const pedidosService = require('./pedidos.service');

class PedidosController {
  async getAllPedidos(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await pedidosService.getAllPedidos(page, limit, req.user);

      res.status(200).json({
        success: true,
        data: result.pedidos,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPedidoById(req, res, next) {
    try {
      const pedido = await pedidosService.getPedidoById(req.params.id, req.user);

      res.status(200).json({
        success: true,
        data: pedido,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPedido(req, res, next) {
    try {
      const pedido = await pedidosService.createPedido(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Pedido created successfully',
        data: pedido,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEstado(req, res, next) {
    try {
      const { estado } = req.body;
      const pedido = await pedidosService.updatePedidoEstado(req.params.id, estado, req.user);

      res.status(200).json({
        success: true,
        message: 'Pedido estado updated successfully',
        data: pedido,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelPedido(req, res, next) {
    try {
      const pedido = await pedidosService.cancelPedido(req.params.id, req.user);

      res.status(200).json({
        success: true,
        message: 'Pedido cancelled successfully',
        data: pedido,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PedidosController();
