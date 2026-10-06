import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import { DELIVERY_STATUS, DELIVERY_PRIORITY, ERROR_TYPES } from "../constants/index.js";
import CustomError from "../errors/CustomError.js";

class DeliveryService {

  async getAllDeliveries(filters = {}) {
    return await deliveryRepository.getAll(filters);
  }

  async getDeliveryById(id) {
    const delivery = await deliveryRepository.getById(id);

    if (!delivery) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_NOT_FOUND,
        cause: `No existe un delivery con id ${id}`
      });
    }

    return delivery;
  }

  async getDeliveryByOrder(orderId) {
    const delivery = await deliveryRepository.getByOrder(orderId);

    if (!delivery) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_NOT_FOUND,
        cause: `No existe un delivery para el pedido ${orderId}`
      });
    }

    return delivery;
  }

  async getDeliveriesByDriver(driverId) {
    return await deliveryRepository.getByDriver(driverId);
  }

  async createDelivery(data) {
  if (!data.order) {
    throw CustomError.createError({
      name: ERROR_TYPES.DELIVERY_INVALID_DATA,
      cause: "El pedido es obligatorio"
    });
  }

  const order = await orderRepository.findById(data.order);

  if (!order) {
    throw CustomError.createError({
      name: ERROR_TYPES.ORDER_NOT_FOUND,
      cause: `El pedido ${data.order} no existe`
    });
  }

  const existingDelivery = await deliveryRepository.getByOrder(data.order);

  if (existingDelivery) {
    throw CustomError.createError({
      name: ERROR_TYPES.DELIVERY_ALREADY_EXISTS,
      cause: "Ya existe un delivery para este pedido"
    });
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
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_STATUS,
        cause: "Solo se puede asignar un repartidor a un delivery pendiente"
      });
    }

    if (!driverId) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_DATA,
        cause: "El repartidor es obligatorio"
      });
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
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_STATUS,
        cause:
          "El delivery debe estar asignado antes de iniciar el traslado"
      });
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
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_STATUS,
        cause:
          "El delivery debe estar en tránsito antes de marcarlo como entregado"
      });
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
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_DATA,
        cause: "Prioridad de delivery inválida"
      });
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