import { z } from 'zod';

export const createUserSchema = z.object({
    first_name: z
        .string({
            required_error: 'First name is required.',
            invalid_type_error: 'First name must be a string.',
        })
        .trim()
        .min(1, {
            message: 'First name is required.',
        }),
    last_name: z
        .string({
            required_error: 'Last name is required.',
            invalid_type_error: 'Last name must be a string.',
        })
        .trim()
        .min(1, {
            message: 'Last name is required.',
        }),
    email: z
        .string({
            required_error: 'Email is required.',
            invalid_type_error: 'Email must be a string.',
        })
        .email({
            message: 'Please, provide a valid email.',
        })
        .trim()
        .min(1, {
            message: 'Email is required.',
        }),
    password: z
        .string({
            required_error: 'Password is required.',
            invalid_type_error: 'Password must be a string.',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters',
        }),
});

export const updateUserSchema = createUserSchema
    .partial()
    .strict({ message: 'Invalid fields provided.' })
    .refine(
        (data) => {
            return Object.keys(data).some((value) => value !== undefined);
        },
        {
            message: 'At least one field must be provided for update.',
        },
    );

export const loginSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required.',
            invalid_type_error: 'Email must be a string.',
        })
        .email({
            message: 'Please, provide a valid email.',
        })
        .trim()
        .min(1, {
            message: 'Email is required.',
        }),
    password: z
        .string({
            required_error: 'Password is required.',
            invalid_type_error: 'Password must be a string.',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters',
        }),
});

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({
            required_error: 'Refresh token is required.',
            invalid_type_error: 'Refresh token must be a string.',
        })
        .trim()
        .min(1, {
            message: 'Refresh token is required.',
        }),
});

export const getUserBalanceSchema = z
    .object({
        userId: z
            .string({
                required_error: 'User ID is required.',
                invalid_type_error: 'User ID must be a string.',
            })
            .uuid({
                message: 'User ID must be a valid UUID.',
            }),
        from: z
            .string({
                required_error: 'From date is required.',
                invalid_type_error: 'From date must be a string.',
            })
            .date({
                message: 'From date must be a valid date string.',
            }),
        to: z
            .string({
                required_error: 'To date is required.',
                invalid_type_error: 'To date must be a string.',
            })
            .date({
                message: 'To date must be a valid date string.',
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
