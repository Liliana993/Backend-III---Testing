import { generateMockUsers } from "../mocks/user.mocks.js";
import { generateMockOrder } from "../mocks/order.mocks.js";
import { generateMockDelivery } from "../mocks/delvery.mocks.js";

import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";

import {
    MOCKING_PARAMETERS,
    USER_ROLE
} from "../constants/index.js";

class MockService {

    validateQuantity(quantity) {
        const parsedQuantity = Number(quantity);

        if (
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1 ||
            parsedQuantity > MOCKING_PARAMETERS.MAX
        ) {
            throw new Error(
                `La cantidad debe ser un número entero entre 1 y ${MOCKING_PARAMETERS.MAX}`
            );
        }

        return parsedQuantity;
    }

    // =========================
    // MOCKS SIN PERSISTENCIA
    // =========================

    getMockUsers(quantity) {
        const qty = this.validateQuantity(quantity);

        return generateMockUsers(qty);
    }

    getMockDrivers(quantity) {
        const qty = this.validateQuantity(quantity);

        return generateMockUsers(
            qty,
            USER_ROLE.DRIVER
        );
    }

    // =========================
    // SEED
    // =========================

    async seed(quantity) {
        const qty = this.validateQuantity(quantity);

        const customers = generateMockUsers(
            qty,
            USER_ROLE.CUSTOMER
        );

        const drivers = generateMockUsers(
            qty,
            USER_ROLE.DRIVER
        );

        // -------------------------
        // 1. Crear clientes
        // -------------------------

        const createdCustomers = [];

        for (const customerData of customers) {
            const customer =
                await userRepository.create(customerData);

            createdCustomers.push(customer);
        }

        // -------------------------
        // 2. Crear repartidores
        // -------------------------

        const createdDrivers = [];

        for (const driverData of drivers) {
            const driver =
                await userRepository.create(driverData);

            createdDrivers.push(driver);
        }

        // -------------------------
        // 3. Crear pedidos
        // -------------------------

        const createdOrders = [];

        for (let i = 0; i < qty; i++) {
            const customer =
                createdCustomers[i % createdCustomers.length];

            const orderData =
                generateMockOrder(customer);

            const order =
                await orderRepository.create(orderData);

            createdOrders.push(order);
        }

        // -------------------------
        // 4. Crear entregas
        // -------------------------

        const createdDeliveries = [];

        for (let i = 0; i < createdOrders.length; i++) {
            const order = createdOrders[i];

            const driver =
                createdDrivers[i % createdDrivers.length];

            const deliveryData =
                generateMockDelivery(order, driver);

            const delivery =
                await deliveryRepository.create(deliveryData);

            createdDeliveries.push(delivery);

            // Relacionar Delivery con Order
            await orderRepository.setDelivery(
                order._id,
                delivery._id
            );
        }

        return {
            inserted: {
                users: createdCustomers.length + createdDrivers.length,
                customers: createdCustomers.length,
                drivers: createdDrivers.length,
                orders: createdOrders.length,
                deliveries: createdDeliveries.length
            }
        };
    }
}

export default new MockService();
