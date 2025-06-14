import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user as fakeUser } from '../../../tests/';
import { PostgresCreateTransactionRepository } from './create-transaction';

describe('CreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        const user = await prisma.user.create({ data: fakeUser });
        const sut = new PostgresCreateTransactionRepository();

        const result = await sut.execute({ ...transaction, userId: user.id });

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
});
