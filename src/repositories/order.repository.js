import Order from "../models/order.model.js";

class OrderRepository {
 // Método para obtener todas las órdenes con filtros y paginación
 async findAll(filters = {}) {
  const {
    status,
    priority,
    customer,
    page = 1,
    limit = 10
  } = filters;

  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (customer) query.customer = customer;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("customer", "firstName lastName email")
      .populate("delivery")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments(query)
  ]);

  return {
    data: orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
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
        returnDocument: "after",
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
    { returnDocument: "after", runValidators: true }
   )
    .populate("customer", "firstName lastName email")
    .populate("delivery");
  }

}

// Exportamos una instancia de la clase OrderRepository
export default new OrderRepository();