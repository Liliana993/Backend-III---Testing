import { generateMockUsers } from "../mocks/user.mocks.js";
import { generateMockOrder } from "../mocks/order.mocks.js";
import { generateMockDelivery } from "../mocks/delvery.mocks.js";

import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";

import {
  MOCKING_PARAMETERS,
  USER_ROLE,
  ERROR_TYPES
} from "../constants/index.js";

import CustomError from "../errors/CustomError.js";

class MockService {
  validateQuantity(quantity) {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      parsedQuantity > MOCKING_PARAMETERS.MAX
    ) {
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_QUANTITY,
        cause: `La cantidad debe ser un número entero entre 1 y ${MOCKING_PARAMETERS.MAX}`
      });
    }

    return parsedQuantity;
  }

  // =========================
  // MOCKS SIN PERSISTENCIA
  // =========================

  getMockUsers(quantity) {
    const qty = this.validateQuantity(quantity);

    try {
      return generateMockUsers(qty);
    } catch (error) {
      throw CustomError.createError({
        name: ERROR_TYPES.MOCK_GENERATION_ERROR,
        cause: `No se pudieron generar los usuarios mock: ${error.message}`
      });
    }
  }

  getMockDrivers(quantity) {
    const qty = this.validateQuantity(quantity);

    try {
      return generateMockUsers(
        qty,
        USER_ROLE.DRIVER
      );
    } catch (error) {
      throw CustomError.createError({
        name: ERROR_TYPES.MOCK_GENERATION_ERROR,
        cause: `No se pudieron generar los drivers mock: ${error.message}`
      });
    }
  }

  // =========================
  // SEED
  // =========================

  async seed(quantity) {
    const qty = this.validateQuantity(quantity);

    let customers;
    let drivers;

    // -------------------------
    // 1. Generar mocks
    // -------------------------

    try {
      customers = generateMockUsers(
        qty,
        USER_ROLE.CUSTOMER
      );

      drivers = generateMockUsers(
        qty,
        USER_ROLE.DRIVER
      );
    } catch (error) {
      throw CustomError.createError({
        name: ERROR_TYPES.MOCK_GENERATION_ERROR,
        cause: `No se pudieron generar los usuarios mock: ${error.message}`
      });
    }

    // -------------------------
    // 2. Persistencia
    // -------------------------

    try {
      // Crear clientes
      const createdCustomers = [];

      for (const customerData of customers) {
        const customer =
          await userRepository.create(customerData);

        createdCustomers.push(customer);
      }

      // Crear repartidores
      const createdDrivers = [];

      for (const driverData of drivers) {
        const driver =
          await userRepository.create(driverData);

        createdDrivers.push(driver);
      }

      // Crear pedidos
      const createdOrders = [];

      for (let i = 0; i < qty; i++) {
        const customer =
          createdCustomers[
            i % createdCustomers.length
          ];

        const orderData =
          generateMockOrder(customer);

        const order =
          await orderRepository.create(orderData);

        createdOrders.push(order);
      }

      // Crear entregas
      const createdDeliveries = [];

      for (let i = 0; i < createdOrders.length; i++) {
        const order = createdOrders[i];

        const driver =
          createdDrivers[
            i % createdDrivers.length
          ];

        const deliveryData =
          generateMockDelivery(
            order,
            driver
          );

        const delivery =
          await deliveryRepository.create(
            deliveryData
          );

        createdDeliveries.push(delivery);

        // Relacionar Delivery con Order
        await orderRepository.setDelivery(
          order._id,
          delivery._id
        );
      }

      return {
        inserted: {
          users:
            createdCustomers.length +
            createdDrivers.length,
          customers:
            createdCustomers.length,
          drivers:
            createdDrivers.length,
          orders:
            createdOrders.length,
          deliveries:
            createdDeliveries.length
        }
      };
    } catch (error) {
      throw CustomError.createError({
        name: ERROR_TYPES.MOCK_DATABASE_ERROR,
        cause: `No se pudieron guardar los datos mock: ${error.message}`
      });
    }
  }
}

export default new MockService();