import { faker } from "@faker-js/faker";

import {
    DELIVERY_STATUS,
    DELIVERY_PRIORITY,
    MOCKING_PARAMETERS
} from "../constants/index.js";

export const generateMockDelivery = (
    order = null,
    driver = null
) => {
    const status = faker.helpers.arrayElement(
        Object.values(DELIVERY_STATUS)
    );

    return {
        order: order?._id ?? null,

        driver: driver?._id ?? null,

        status,

        priority: faker.helpers.arrayElement(
            Object.values(DELIVERY_PRIORITY)
        ),

        assignedAt:
            driver && status !== DELIVERY_STATUS.PENDING
                ? faker.date.recent()
                : null,

        deliveredAt:
            status === DELIVERY_STATUS.DELIVERED
                ? faker.date.recent()
                : null
    };
};

export const generateMockDeliveries = (
    count = MOCKING_PARAMETERS.DEFAULT,
    order = null,
    driver = null
) => {
    const deliveries = [];

    for (let i = 0; i < count; i++) {
        deliveries.push(
            generateMockDelivery(order, driver)
        );
    }

    return deliveries;
};