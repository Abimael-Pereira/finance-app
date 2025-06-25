import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { prisma } from '../../../../prisma/prisma.js';
import { transaction, user } from '../../../tests/';
import { PostgresDeleteTransactionRepository } from './delete-transaction';
import { TransactionNotFoundError } from '../../../errors/';

dayjs.extend(dayjsPluginUTC);

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
        expect(dayjs.utc(result.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        );
    });

    it('shoul call prisma with correct params', async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, userId: user.id },
        });
        const sut = new PostgresDeleteTransactionRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'delete');

        await sut.execute(transaction.id);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        });
    });

    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository();

        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        );

        const result = sut.execute(transaction.id);

        await expect(result).rejects.toThrow();
    });

    it('should throw TransactionNotFoundError if transaction not found', async () => {
        const sut = new PostgresDeleteTransactionRepository();

        const result = sut.execute(transaction.id);

        await expect(result).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        );
    });
});
