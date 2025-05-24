import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { PostgresCreateUserRepository } from '../repositories/postgres-db/create-user.js';

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o e-mail já está em uso

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const postgresCreateUserRepository = new PostgresCreateUserRepository();
        const createdUser = await postgresCreateUserRepository.execute(user);

        return createdUser;
    }
}
