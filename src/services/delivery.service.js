import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import {
  DELIVERY_STATUS,
  DELIVERY_PRIORITY,
  ERROR_TYPES,
} from "../constants/index.js";
import CustomError from "../errors/CustomError.js";
import logger from "../config/logger.config.js";

class DeliveryService {
 // Método para obtener todas las entregas con filtros y paginación  
 async getAllDeliveries(filters = {}) {
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

   const result = await deliveryRepository.getAll({
    ...filters,
    page,
    limit
   });

   return result;
  }


  async getDeliveryById(id) {
    logger.debug("Buscando delivery por ID", { deliveryId: id });

    const delivery = await deliveryRepository.getById(id);

    if (!delivery) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_NOT_FOUND,
        cause: `No existe un delivery con id ${id}`,
      });
    }

    return delivery;
  }

  async getDeliveryByOrder(orderId) {
    logger.debug("Buscando delivery por pedido", { orderId });

    const delivery = await deliveryRepository.getByOrder(orderId);

    if (!delivery) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_NOT_FOUND,
        cause: `No existe un delivery para el pedido ${orderId}`,
      });
    }

    return delivery;
  }

   
 async getDeliveriesByDriver(driverId, filters = {}) {
  logger.debug("Consultando deliveries por repartidor", {
    driverId
  });

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

  const result = await deliveryRepository.getByDriver(driverId, {
    page,
    limit
  });

  logger.info("Deliveries del repartidor consultados", {
    driverId,
    count: result.data.length,
    total: result.total
  });

  return result;
 }


  async createDelivery(data) {
    logger.debug("Iniciando creación de delivery", {
      orderId: data.order,
    });

    if (!data.order) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_DATA,
        cause: "El pedido es obligatorio",
      });
    }

    const order = await orderRepository.findById(data.order);

    if (!order) {
      throw CustomError.createError({
        name: ERROR_TYPES.ORDER_NOT_FOUND,
        cause: `El pedido ${data.order} no existe`,
      });
    }

    const existingDelivery =
      await deliveryRepository.getByOrder(data.order);

    if (existingDelivery) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_ALREADY_EXISTS,
        cause: "Ya existe un delivery para este pedido",
      });
    }

    const deliveryData = {
      ...data,
      status: data.status || DELIVERY_STATUS.PENDING,
      priority: data.priority || DELIVERY_PRIORITY.NORMAL,
    };

    const delivery =
      await deliveryRepository.create(deliveryData);

    await orderRepository.setDelivery(
      data.order,
      delivery._id
    );

    const createdDelivery =
      await deliveryRepository.getById(delivery._id);

    logger.info("Delivery creado correctamente", {
      deliveryId: String(delivery._id),
      orderId: String(data.order),
    });

    return createdDelivery;
  }

  async assignDriver(deliveryId, driverId) {
    logger.debug("Iniciando asignación de repartidor", {
      deliveryId,
      driverId,
    });

    const delivery = await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.PENDING) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_STATUS,
        cause:
          "Solo se puede asignar un repartidor a un delivery pendiente",
      });
    }

    if (!driverId) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_DATA,
        cause: "El repartidor es obligatorio",
      });
    }

    const updatedDelivery =
      await deliveryRepository.updateById(deliveryId, {
        driver: driverId,
        status: DELIVERY_STATUS.ASSIGNED,
        assignedAt: new Date(),
      });

    logger.info("Repartidor asignado correctamente", {
      deliveryId,
      driverId,
    });

    return updatedDelivery;
  }

  async startDelivery(deliveryId) {
    logger.debug("Iniciando traslado del delivery", {
      deliveryId,
    });

    const delivery = await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.ASSIGNED) {
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_STATUS,
        cause:
          "El delivery debe estar asignado antes de iniciar el traslado",
      });
    }

    const updatedDelivery =
      await deliveryRepository.updateById(deliveryId, {
        status: DELIVERY_STATUS.IN_TRANSIT,
      });

    logger.info("Delivery en tránsito", { deliveryId });

    return updatedDelivery;
  }

    async completeDelivery(deliveryId) {
    logger.debug("Iniciando finalización del delivery", {
      deliveryId,
    });

    const delivery = await this.getDeliveryById(deliveryId);

    if (delivery.status !== DELIVERY_STATUS.IN_TRANSIT) {
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_STATUS,
        cause:
          "El delivery debe estar en tránsito antes de marcarlo como entregado",
      });
    }

    const updatedDelivery =
      await deliveryRepository.updateById(deliveryId, {
        status: DELIVERY_STATUS.DELIVERED,
        deliveredAt: new Date(),
      });

    logger.info("Delivery completado correctamente", {
      deliveryId,
    });

    return updatedDelivery;
  }

  // NUEVO MÉTODO: agregar comprobantes
  async addDeliveryProofs(deliveryId, files) {
    logger.debug("Iniciando carga de comprobantes", {
      deliveryId,
      count: files.length
    });

    try {
      await this.getDeliveryById(deliveryId);

      const proofs = files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        path: `uploads/deliveries/proofs/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      }));

      const updatedDelivery = await deliveryRepository.updateById(
        deliveryId,
        {
          $push: {
            proofs: {
              $each: proofs
            }
          }
        }
      );

      logger.info("Comprobantes cargados correctamente", {
        deliveryId,
        count: proofs.length
      });

      return updatedDelivery;

    } catch (error) {
      const fs = await import("fs/promises");

      await Promise.all(
        files.map(file => fs.unlink(file.path).catch(() => {}))
      );

      throw error;
    }
  }


  async updatePriority(deliveryId, priority) {
    logger.debug("Actualizando prioridad del delivery", {
      deliveryId,
      priority,
    });

    if (!Object.values(DELIVERY_PRIORITY).includes(priority)) {
      throw CustomError.createError({
        name: ERROR_TYPES.DELIVERY_INVALID_DATA,
        cause: "Prioridad de delivery inválida",
      });
    }

    await this.getDeliveryById(deliveryId);

    const updatedDelivery =
      await deliveryRepository.updateById(deliveryId, {
        priority,
      });

    logger.info("Prioridad del delivery actualizada", {
      deliveryId,
      priority,
    });

    return updatedDelivery;
  }

  async deleteDelivery(id) {
    logger.debug("Iniciando eliminación de delivery", {
      deliveryId: id,
    });

    await this.getDeliveryById(id);

    const deletedDelivery =
      await deliveryRepository.deleteById(id);

    logger.info("Delivery eliminado correctamente", {
      deliveryId: id,
    });

    return deletedDelivery;
  }
}

export default new DeliveryService();