import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import {
    transaction,
    user as fakeUser,
    typesOfTransaction,
} from '../../../tests/';
import { PostgresUpdateTransactionRepository } from './update-transaction';
import { faker } from '@faker-js/faker';
import { TransactionNotFoundError } from '../../../errors';

describe('UpdateTransactionRepository', () => {
    const paramsUpdate = {
        id: transaction.id,
        userId: fakeUser.id,
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(typesOfTransaction),
        amount: Number(faker.finance.amount()),
    };

    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: fakeUser });
        await prisma.transaction.create({
            data: { ...transaction, userId: fakeUser.id },
        });

        const sut = new PostgresUpdateTransactionRepository();

        const result = await sut.execute(transaction.id, paramsUpdate);

        expect({
            ...result,
            amount: result.amount.toString(),
            date: undefined,
        }).toStrictEqual({
            ...paramsUpdate,
            amount: paramsUpdate.amount.toString(),
            date: undefined,
        });
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(transaction.date).month(),
        );
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
    });

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: fakeUser });
        await prisma.transaction.create({
            data: { ...transaction, userId: fakeUser.id },
        });
        const sut = new PostgresUpdateTransactionRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'update');

        await sut.execute(transaction.id, paramsUpdate);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: paramsUpdate,
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository();

        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        );

        const result = sut.execute(transaction.id, paramsUpdate);

        await expect(result).rejects.toThrow();
    });

    it('should throw if transaction does not exist', async () => {
        const transactionId = faker.string.uuid();
        const sut = new PostgresUpdateTransactionRepository();

        await expect(sut.execute(transactionId, paramsUpdate)).rejects.toThrow(
            new TransactionNotFoundError(transactionId),
        );
    });
});
