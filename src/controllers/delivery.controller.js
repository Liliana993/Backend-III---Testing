import deliveryService from "../services/delivery.service.js";

class DeliveryController {

  async getAll(req, res, next) {
    try {
      const { status, priority, driver } = req.query;

      const deliveries = await deliveryService.getAllDeliveries({
        status,
        priority,
        driver
      });

      res.status(200).json({
        status: "success",
        payload: deliveries
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

      const deliveries =
        await deliveryService.getDeliveriesByDriver(driverId);

      res.status(200).json({
        status: "success",
        payload: deliveries
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