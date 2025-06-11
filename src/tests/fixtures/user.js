import { faker } from '@faker-js/faker';

export const user = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: faker.internet.password(),
};

export const userBalance = {
    earnings: '1000',
    expenses: '500',
    invesments: '200',
    balance: '300',
};
