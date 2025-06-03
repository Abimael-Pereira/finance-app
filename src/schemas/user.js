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
