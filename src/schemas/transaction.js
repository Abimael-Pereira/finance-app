import validator from 'validator';
import { z } from 'zod';

export const createTransactionSchema = z.object({
    userId: z.string().uuid({
        message: 'User ID must be a valid UUID',
        invalid_type_error: 'User ID must be a string',
        required_error: 'User ID is required',
    }),
    name: z
        .string({
            invalid_type_error: 'Name must be a string',
            required_error: 'Name is required',
        })
        .trim()
        .min(1, 'Name is required'),
    date: z.string().datetime({
        message: 'Date must be a valid ISO 8601 date string',
        invalid_type_error: 'Date must be a string',
        required_error: 'Date is required',
    }),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must be one of EXPENSE, EARNING, or INVESTMENT',
        }),
    }),
    amount: z
        .number({
            invalid_type_error: 'Amount must be a number',
            required_error: 'Amount is required',
        })
        .min(1, 'Amount must be a positive number')
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
            }),
        ),
});

export const updateTransactionSchema = createTransactionSchema
    .omit({ userId: true })
    .partial()
    .strict({
        message: 'Invalid fields provided.',
    })
    .refine(
        (data) => Object.keys(data).some((key) => data[key] !== undefined),
        {
            message: 'At least one field must be provided for update.',
        },
    );

export const getTransactionByUserIdSchema = z
    .object({
        userId: z.string().uuid({
            message: 'User ID must be a valid UUID',
            invalid_type_error: 'User ID must be a string',
            required_error: 'User ID is required',
        }),
        from: z.string().date({
            message: 'From date must be a valid date string',
            invalid_type_error: 'From date must be a string',
            required_error: 'From date is required',
        }),
        to: z.string().date({
            message: 'To date must be a valid date string',
            invalid_type_error: 'To date must be a string',
            required_error: 'To date is required',
        }),
    })
    .refine(
        (data) => {
            if (data.from && data.to) {
                return new Date(data.from) <= new Date(data.to);
            }
            return true;
        },
        {
            message: 'From date must be earlier than or equal to To date.',
        },
    );

export const deleteTransactionSchema = z.object({
    transactionId: z.string().uuid({
        message: 'Transaction ID must be a valid UUID',
        invalid_type_error: 'Transaction ID must be a string',
        required_error: 'Transaction ID is required',
    }),
    userId: z.string().uuid({
        message: 'User ID must be a valid UUID',
        invalid_type_error: 'User ID must be a string',
        required_error: 'User ID is required',
    }),
});
