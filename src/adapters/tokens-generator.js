export class TokensGeneratorAdapter {
    constructor(jwt) {
        this.jwt = jwt;
    }

    execute(userId) {
        const tokens = {
            accessToken: this.jwt.sign(
                { userId },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' },
            ),
            refreshToken: this.jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' },
            ),
        };

        return tokens;
    }
}
