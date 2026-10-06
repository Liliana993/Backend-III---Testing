import orderService from "../services/order.service.js";

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAll(req.query);

      return res.status(200).json({
        status: "success",
        message: "Órdenes obtenidas exitosamente",
        payload: orders
      });
    } catch (error) {
      next(error); // Pasamos el error al middleware de manejo de errores
    }
  }

  async getOrderById(req, res, next) {
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
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);

      return res.status(201).json({
        status: "success",
        message: "Orden creada exitosamente",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
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
      next(error);
    }
  }

  async delete(req, res, next) {
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
      next(error);
    }
  }
}


// Exportamos una instancia de la clase OrderController
export default new OrderController();