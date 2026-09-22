import deliveryService from "../services/delivery.service.js";

class DeliveryController {

  async getAll(req, res) {
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
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const delivery = await deliveryService.getDeliveryById(id);

      res.status(200).json({
        status: "success",
        payload: delivery
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getByOrder(req, res) {
    try {
      const { orderId } = req.params;

      const delivery = await deliveryService.getDeliveryByOrder(orderId);

      res.status(200).json({
        status: "success",
        payload: delivery
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getByDriver(req, res) {
    try {
      const { driverId } = req.params;

      const deliveries =
        await deliveryService.getDeliveriesByDriver(driverId);

      res.status(200).json({
        status: "success",
        payload: deliveries
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const delivery = await deliveryService.createDelivery(req.body);

      res.status(201).json({
        status: "success",
        message: "Delivery creado correctamente",
        payload: delivery
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async assignDriver(req, res) {
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
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async startDelivery(req, res) {
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
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async completeDelivery(req, res) {
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
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async updatePriority(req, res) {
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
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await deliveryService.deleteDelivery(id);

      res.status(200).json({
        status: "success",
        message: "Delivery eliminado correctamente"
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new DeliveryController();