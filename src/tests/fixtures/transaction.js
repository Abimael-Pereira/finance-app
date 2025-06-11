import { faker } from '@faker-js/faker';

const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

export const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(types),
    amount: Number(faker.finance.amount()),
};

export const transactionWithoutId = {
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(types),
    amount: Number(faker.finance.amount()),
};

export const updateTransactionParams = {
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(types),
    amount: Number(faker.finance.amount()),
};
