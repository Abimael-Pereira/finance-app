import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user as fakeUser } from '../../../tests/';
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-userid';

describe('GetTransactionsByUserId', () => {
    it('should get transactions by user id on db', async () => {
        await prisma.user.create({ data: fakeUser });
        await prisma.transaction.create({
            data: { ...transaction, userId: fakeUser.id },
        });

        const sut = new PostgresGetTransactionsByUserIdRepository();

        const result = await sut.execute(fakeUser.id);

        expect(result.length).toBe(1);
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
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(transaction.date).month(),
        );
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
    });
});
