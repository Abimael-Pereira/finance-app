import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user } from '../../../tests/';
import { PostgresCreateTransactionRepository } from './create-transaction';

dayjs.extend(dayjsPluginUTC);

describe('CreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresCreateTransactionRepository();

        const result = await sut.execute({
            ...transaction,
            userId: user.id,
        });

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

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresCreateTransactionRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'create');

        await sut.execute({ ...transaction, userId: user.id });

        expect(prismaSpy).toHaveBeenCalledWith({
            data: { ...transaction, userId: user.id },
        });
    });

    it('should throws if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository();

        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error(),
        );

        const result = sut.execute(transaction);

        await expect(result).rejects.toThrow();
    });
});
