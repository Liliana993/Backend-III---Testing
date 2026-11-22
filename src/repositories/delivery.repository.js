import Delivery from "../models/delivery.model.js";

class DeliveryRepository {
  // Método para obtener todas las entregas con filtros y paginación 
 async getAll(filters = {}) {
   const {
    status,
    priority,
    driver,
    page = 1,
    limit = 10
   } = filters;

   const query = {};

   if (status) query.status = status;
   if (priority) query.priority = priority;
   if (driver) query.driver = driver;

   const skip = (page - 1) * limit;

   const [deliveries, total] = await Promise.all([
    Delivery.find(query)
      .populate("order")
      .populate("driver", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Delivery.countDocuments(query)
   ]);

   return {
    data: deliveries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
   };
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

  
 async getByDriver(driverId, { page = 1, limit = 10 } = {}) {
  const query = { driver: driverId };
  const skip = (page - 1) * limit;

  const [deliveries, total] = await Promise.all([
    Delivery.find(query)
      .populate("order")
      .populate("driver", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Delivery.countDocuments(query)
  ]);

  return {
    data: deliveries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
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