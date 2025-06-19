import { notFound } from './index.js';

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found',
    });
};
