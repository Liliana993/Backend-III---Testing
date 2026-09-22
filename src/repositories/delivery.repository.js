import Delivery from "../models/delivery.model.js";

class DeliveryRepository {

  async getAll(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.driver) {
      query.driver = filters.driver;
    }

    return Delivery.find(query)
      .populate("order")
      .populate("driver", "-password")
      .sort({ createdAt: -1 });
  }

  async getById(id) {
    return Delivery.findById(id)
      .populate("order")
      .populate("driver", "-password");
  }

  async getByOrder(orderId) {
    return Delivery.findOne({
      order: orderId
    })
      .populate("order")
      .populate("driver", "-password");
  }

  async getByDriver(driverId) {
    return Delivery.find({
      driver: driverId
    })
      .populate("order")
      .populate("driver", "-password")
      .sort({ createdAt: -1 });
  }

  async create(data) {
    return Delivery.create(data);
  }

  async updateById(id, data) {
    return Delivery.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("order")
      .populate("driver", "-password");
  }

  async deleteById(id) {
    return Delivery.findByIdAndDelete(id);
  }
}

export default new DeliveryRepository();