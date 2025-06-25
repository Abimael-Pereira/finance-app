import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user as fakeUser } from '../../../tests/';
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-userid';

dayjs.extend(dayjsPluginUTC);

describe('GetTransactionsByUserId', () => {
    const from = '2025-01-01';
    const to = '2025-12-31';

    it('should get transactions by user id on db', async () => {
        await prisma.user.create({ data: fakeUser });
        await prisma.transaction.create({
            data: { ...transaction, userId: fakeUser.id },
        });

        const sut = new PostgresGetTransactionsByUserIdRepository();

        const result = await sut.execute(fakeUser.id, from, to);

        console.log(result);

        expect({
            ...result[0],
            amount: result[0].amount.toString(),
            date: undefined,
        }).toStrictEqual({
            ...transaction,
            amount: transaction.amount.toString(),
            userId: fakeUser.id,
            date: undefined,
        });
        expect(dayjs.utc(result[0].date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        );
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany');

        await sut.execute(fakeUser.id, from, to);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                userId: fakeUser.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository();

        jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
            new Error(),
        );

        const result = sut.execute(fakeUser.id);

        await expect(result).rejects.toThrow();
    });
});
