import jwt from 'jsonwebtoken';

export class TokensGeneratorAdapter {
    execute(userId) {
        const tokens = {
            accessToken: jwt.sign(
                { userId },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' },
            ),
            refreshToken: jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' },
            ),
        };

        return tokens;
    }
}
