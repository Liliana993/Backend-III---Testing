import orderService from "../services/order.service.js";

class OrderController {
  async getAll(req, res) {
    try {
      const orders = await orderService.getAll(req.query);

      return res.status(200).json({
        status: "success",
        message: "Órdenes obtenidas exitosamente",
        payload: orders
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(
        req.params.id
      );

      return res.status(200).json({
        status: "success",
        message: "Orden obtenida exitosamente",
        payload: order
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const order = await orderService.create(req.body);

      return res.status(201).json({
        status: "success",
        message: "Orden creada exitosamente",
        payload: order
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const order = await orderService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        status: "success",
        message: "Orden actualizada exitosamente",
        payload: order
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const order = await orderService.delete(
        req.params.id
      );

      return res.status(200).json({
        status: "success",
        message: "Orden borrada exitosamente",
        payload: order
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

// Exportamos una instancia de la clase OrderController
export default new OrderController();