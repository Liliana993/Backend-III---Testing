import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import config from "../config/env.config.js";
// Importamos el logger para registrar eventos importantes
import logger from "../config/logger.config.js";
// Importamos los tipos de error desde el diccionario de errores
import {
  ORDER_STATUS,
  ORDER_PRIORITY,
  ERROR_TYPES
} from "../constants/index.js";
import CustomError from "../errors/CustomError.js";

class OrderService {

  // Método para obtener todas las órdenes con filtros y paginación
  async getAll(filters = {}) {
   const requestedPage = Number(filters.page);
   const requestedLimit = Number(filters.limit);

   const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

   const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;

   return orderRepository.findAll({
    ...filters,
    page,
    limit
  });
 }


  async getOrderById(id) {
    const order = await orderRepository.findById(id);

    if (!order) {
      logger.warning(`Pedido no encontrado: ${id}`);

       throw CustomError.createError({
        name: ERROR_TYPES.ORDER_NOT_FOUND,
        cause: `No existe una orden con id ${id}`
  });
    }

    return order;
  }

  async create(orderData) {
    const {
      customer,
      deliveryAddress,
      items
    } = orderData;

    if (
      !customer ||
      !deliveryAddress ||
      !items ||
      items.length < 1
    ) {
      throw CustomError.createError({
       name: ERROR_TYPES.VALIDATION_ERROR,
       cause: "customer, deliveryAddress e items son campos requeridos"
      });
    }

    // El Service no accede directamente a Mongoose.
    const existingCustomer = await userRepository.getById(customer);

    if (!existingCustomer) {
      logger.warning(`Cliente no encontrado: ${customer}`);
      throw CustomError.createError({
       name: ERROR_TYPES.USER_NOT_FOUND,
       cause: `No existe un usuario con id ${customer}`
      });
    }

    const total = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const shippingCost = this.calculateShippingCost({
      isProduction: config.environment === "production",
      shipmentValue: total
    });

    return await orderRepository.create({
      ...orderData,
      declaredValue: total,
      shippingCost,
      total: total + shippingCost,
      status: ORDER_STATUS.CREATED,
      priority: orderData.priority || ORDER_PRIORITY.NORMAL
    });
  }

  async update(id, orderData) {
    const updatedOrder = await orderRepository.update(
      id,
      orderData
    );

    if (!updatedOrder) {
      logger.warning(`Pedido no encontrado: ${id}`);
      throw CustomError.createError({
        name: ERROR_TYPES.ORDER_NOT_FOUND,
        cause: `No existe una orden con id ${id}`
      });
    }

    return updatedOrder;
  }

  async delete(id) {
    const deletedOrder = await orderRepository.delete(id);

    if (!deletedOrder) {
      logger.warning(`Pedido no encontrado: ${id}`);
      throw CustomError.createError({
        name: ERROR_TYPES.ORDER_NOT_FOUND,
        cause: `No existe una orden con id ${id}`
      });
    }

    return deletedOrder;
  }

  calculateShippingCost({
    isProduction,
    shipmentValue
  }) {
    if (isProduction) {
      return 50 + shipmentValue * 0.01;
    }

    return 10;
  }
}

// Exportamos una instancia de la clase OrderService
export default new OrderService();