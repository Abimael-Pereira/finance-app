import { badRequest, notFound } from './index.js';

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters',
    });

export const emailAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    });

export const emailIsNotValidResponse = () =>
    badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    });

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found.',
    });
