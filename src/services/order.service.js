import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import config from "../config/env.config.js";
// Importamos los tipos de error desde el diccionario de errores
import {
  ORDER_STATUS,
  ORDER_PRIORITY,
  ERROR_TYPES
} from "../constants/index.js";
import CustomError from "../errors/CustomError.js";

class OrderService {

  async getAll(filter = {}) {
    return await orderRepository.findAll(filter);
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);

    if (!order) {
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