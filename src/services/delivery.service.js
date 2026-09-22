import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import { DELIVERY_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

class DeliveryService {

  async getAllDeliveries(filters = {}) {
    return await deliveryRepository.getAll(filters);
  }

  async getDeliveryById(id) {
    const delivery = await deliveryRepository.getById(id);

    if (!delivery) {
      throw new Error("Delivery no encontrado");
    }

    return delivery;
  }

  async getDeliveryByOrder(orderId) {
    const delivery = await deliveryRepository.getByOrder(orderId);

    if (!delivery) {
      throw new Error("No existe un delivery para este pedido");
    }

    return delivery;
  }

  async getDeliveriesByDriver(driverId) {
    return await deliveryRepository.getByDriver(driverId);
  }

  async createDelivery(data) {
  if (!data.order) {
    throw new Error("El pedido es obligatorio");
  }

  const order = await orderRepository.findById(data.order);

  if (!order) {
    throw new Error("El pedido no existe");
  }

  const existingDelivery = await deliveryRepository.getByOrder(data.order);

  if (existingDelivery) {
    throw new Error("Ya existe un delivery para este pedido");
  }

  const deliveryData = {
    ...data,
    status: data.status || DELIVERY_STATUS.PENDING,
    priority: data.priority || DELIVERY_PRIORITY.NORMAL
  };

  const delivery = await deliveryRepository.create(deliveryData);

  await orderRepository.setDelivery(
    data.order,
    delivery._id
  );

  return await deliveryRepository.getById(delivery._id);
 }

  async assignDriver(deliveryId, driverId) {

    const delivery =
      await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.PENDING) {
      throw new Error(
        "Solo se puede asignar un repartidor a un delivery pendiente"
      );
    }

    if (!driverId) {
      throw new Error(
        "El repartidor es obligatorio"
      );
    }

    return await deliveryRepository.updateById(
      deliveryId,
      {
        driver: driverId,
        status: DELIVERY_STATUS.ASSIGNED,
        assignedAt: new Date()
      }
    );
  }

  async startDelivery(deliveryId) {

    const delivery =
      await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.ASSIGNED) {
      throw new Error(
        "El delivery debe estar asignado antes de iniciar el traslado"
      );
    }

    return await deliveryRepository.updateById(
      deliveryId,
      {
        status: DELIVERY_STATUS.IN_TRANSIT
      }
    );
  }

  async completeDelivery(deliveryId) {

    const delivery =
      await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.IN_TRANSIT) {
      throw new Error(
        "El delivery debe estar en tránsito antes de marcarlo como entregado"
      );
    }

    return await deliveryRepository.updateById(
      deliveryId,
      {
        status: DELIVERY_STATUS.DELIVERED,
        deliveredAt: new Date()
      }
    );
  }

  async updatePriority(deliveryId, priority) {

    if (!Object.values(DELIVERY_PRIORITY).includes(priority)) {
      throw new Error(
        "Prioridad de delivery inválida"
      );
    }

    await this.getDeliveryById(deliveryId);

    return await deliveryRepository.updateById(
      deliveryId,
      {
        priority
      }
    );
  }

  async deleteDelivery(id) {

    await this.getDeliveryById(id);

    return await deliveryRepository.deleteById(id);
  }
}

export default new DeliveryService();