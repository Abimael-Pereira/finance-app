import { notFound, unauthorized } from './index.js';

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found',
    });
};

export const invalidPasswordResponse = () => {
    return unauthorized({
        message: 'Invalid password',
    });
};
