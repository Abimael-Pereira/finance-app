import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma.js';
import { transaction, user } from '../../../tests/';
import { PostgresDeleteTransactionRepository } from './delete-transaction';

describe('DeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, userId: user.id },
        });

        const sut = new PostgresDeleteTransactionRepository();

        const result = await sut.execute(transaction.id);

        expect({
            ...result,
            amount: result.amount.toString(),
            date: undefined,
        }).toStrictEqual({
            ...transaction,
            amount: transaction.amount.toString(),
            userId: user.id,
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

    it('shoul call prisma with correct params', async () => {
        const sut = new PostgresDeleteTransactionRepository();

        const result = jest.spyOn(prisma.transaction, 'delete');

        await sut.execute(transaction.id);

        await expect(result).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        });
    });
});
