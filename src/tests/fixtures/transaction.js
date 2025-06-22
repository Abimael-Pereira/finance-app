import { faker } from '@faker-js/faker';

export const typesOfTransaction = ['EXPENSE', 'EARNING', 'INVESTMENT'];

export const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(typesOfTransaction),
    amount: Number(faker.finance.amount({ min: 1 })),
};

export const transactionWithoutId = {
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(typesOfTransaction),
    amount: Number(faker.finance.amount({ min: 1 })),
};

export const updateTransactionParams = {
    name: faker.commerce.productName(),
    date: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(typesOfTransaction),
    amount: Number(faker.finance.amount({ min: 1 })),
};
