import jwt from 'jsonwebtoken';

export class TokenVerifierAdapter {
    execute(token, secretKey) {
        return jwt.verify(token, secretKey);
    }
}
