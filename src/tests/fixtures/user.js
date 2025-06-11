import { faker } from '@faker-js/faker';

export const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
};

export const createOrUpdateUserParams = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
};

export const userBalance = {
    earnings: '1000',
    expenses: '500',
    invesments: '200',
    balance: '300',
};
