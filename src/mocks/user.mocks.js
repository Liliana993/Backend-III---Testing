import { faker } from "@faker-js/faker";

import {
    USER_ROLE,
    MOCKING_PARAMETERS
} from "../constants/index.js";

const mockeableRoles = [
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER,
    USER_ROLE.STORE
];

export const generateMockUser = (role = null) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const selectedRole =
        role ?? faker.helpers.arrayElement(mockeableRoles);

    return {
        firstName,
        lastName,
        email: faker.internet.email({
            firstName,
            lastName
        }),
        role: selectedRole,
        password: MOCKING_PARAMETERS.DEFAULT_PASSWORD
    };
};

export const generateMockUsers = (
    count = MOCKING_PARAMETERS.DEFAULT,
    role = null
) => {
    const usersData = [];

    for (let i = 0; i < count; i++) {
        usersData.push(
            generateMockUser(role)
        );
    }

    return usersData;
};