import Order from "../models/order.model.js";

class OrderRepository {
  async findAll(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.customer) {
      query.customer = filters.customer;
    }

    return Order.find(query)
      .populate("customer", "firstName lastName email")
      .populate("delivery")
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return Order.findById(id)
      .populate("customer", "firstName lastName email")
      .populate("delivery");
  }

  async create(orderData) {
    return Order.create(orderData);
  }

  async update(id, orderData) {
    return Order.findByIdAndUpdate(
      id,
      orderData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("customer", "firstName lastName email")
      .populate("delivery");
  }

  async delete(id) {
    return Order.findByIdAndDelete(id);
  }
  async setDelivery(orderId, deliveryId) {
  return Order.findByIdAndUpdate(
    orderId,
    { delivery: deliveryId },
    { new: true, runValidators: true }
   )
    .populate("customer", "firstName lastName email")
    .populate("delivery");
  }

}

// Exportamos una instancia de la clase OrderRepository
export default new OrderRepository();