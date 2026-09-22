import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import config from "../config/config.js";
import {
  ORDER_STATUS,
  ORDER_PRIORITY
} from "../constants/index.js";

class OrderService {

  async getAll(filter = {}) {
    return await orderRepository.findAll(filter);
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new Error("Orden no encontrada");
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
      throw new Error("Falta información requerida");
    }

    // El Service no accede directamente a Mongoose.
    const existingCustomer = await userRepository.getById(customer);

    if (!existingCustomer) {
      throw new Error("Cliente no encontrado");
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
    const updatedOrder = await this.orderRepository.update(
      id,
      orderData
    );

    if (!updatedOrder) {
      throw new Error("Pedido no encontrado");
    }

    return updatedOrder;
  }

  async delete(id) {
    const deletedOrder = await orderRepository.delete(id);

    if (!deletedOrder) {
      throw new Error("Pedido no encontrado");
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