import deliveryService from "../services/delivery.service.js";

class DeliveryController {
  // Middleware para asegurar que el delivery exista antes de continuar
    async ensureExists(req, res, next) {
    try {
      await deliveryService.getDeliveryById(req.params.id);
      next();
    } catch (error) {
      next(error);
    }
  }

 // Método para obtener todos los deliveries con filtros y paginación
 async getAll(req, res, next) {
  try {
    const { status, priority, driver, page, limit } = req.query;

    const result = await deliveryService.getAllDeliveries({
      status,
      priority,
      driver,
      page,
      limit
    });

    return res.status(200).json({
      status: "success",
      payload: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
 }


  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const delivery = await deliveryService.getDeliveryById(id);

      res.status(200).json({
        status: "success",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async getByOrder(req, res, next) {
    try {
      const { orderId } = req.params;

      const delivery = await deliveryService.getDeliveryByOrder(orderId);

      res.status(200).json({
        status: "success",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  
 async getByDriver(req, res, next) {
  try {
    const { driverId } = req.params;

    const result = await deliveryService.getDeliveriesByDriver(
      driverId,
      req.query
    );

    return res.status(200).json({
      status: "success",
      payload: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
 }


  async create(req, res, next) {
    try {
      const delivery = await deliveryService.createDelivery(req.body);

      res.status(201).json({
        status: "success",
        message: "Delivery creado correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async assignDriver(req, res, next) {
    try {
      const { id } = req.params;
      const { driverId } = req.body;

      const delivery =
        await deliveryService.assignDriver(id, driverId);

      res.status(200).json({
        status: "success",
        message: "Repartidor asignado correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async startDelivery(req, res, next) {
    try {
      const { id } = req.params;

      const delivery =
        await deliveryService.startDelivery(id);

      res.status(200).json({
        status: "success",
        message: "Delivery iniciado correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async completeDelivery(req, res, next) {
    try {
      const { id } = req.params;

      const delivery =
        await deliveryService.completeDelivery(id);

      res.status(200).json({
        status: "success",
        message: "Delivery completado correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

    async uploadProofs(req, res, next) {
    try {
      const { id } = req.params;

      const delivery = await deliveryService.addDeliveryProofs(
        id,
        req.files
      );

      res.status(201).json({
        status: "success",
        message: "Comprobantes cargados correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async updatePriority(req, res, next) {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      const delivery =
        await deliveryService.updatePriority(id, priority);

      res.status(200).json({
        status: "success",
        message: "Prioridad actualizada correctamente",
        payload: delivery
      });

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await deliveryService.deleteDelivery(id);

      res.status(200).json({
        status: "success",
        message: "Delivery eliminado correctamente"
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveryController();