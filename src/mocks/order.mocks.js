import { faker } from "@faker-js/faker";

import {
    ORDER_STATUS,
    ORDER_PRIORITY,
    MOCKING_PARAMETERS
} from "../constants/index.js";

export const generateMockOrder = (customer = null) => {
    const quantity = faker.number.int({
        min: 1,
        max: 10
    });

    const price = faker.number.float({
        min: 500,
        max: 20000,
        fractionDigits: 2
    });

    const shippingCost = faker.number.float({
        min: 500,
        max: 5000,
        fractionDigits: 2
    });

    const declaredValue = price * quantity;

    return {
        customer: customer?._id ?? null,

        items: [
            {
                name: faker.commerce.productName(),
                quantity,
                price
            }
        ],

        deliveryAddress: faker.location.streetAddress(),

        total: declaredValue + shippingCost,

        shippingCost,

        declaredValue,

        status: faker.helpers.arrayElement(
            Object.values(ORDER_STATUS)
        ),

        priority: faker.helpers.arrayElement(
            Object.values(ORDER_PRIORITY)
        ),

        delivery: null
    };
};

export const generateMockOrders = (
    count = MOCKING_PARAMETERS.DEFAULT,
    customer = null
) => {
    const orders = [];

    for (let i = 0; i < count; i++) {
        orders.push(
            generateMockOrder(customer)
        );
    }

    return orders;
};