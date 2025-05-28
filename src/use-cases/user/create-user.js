import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { PostgresGetUserByEmailRepository } from '../../repositories/postgres-db/index.js';
import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
    constructor(createUserRepository) {
        this.createUserRepository = createUserRepository;
    }
    async execute(createUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository();
        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            );

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createdUser = await this.createUserRepository.execute(user);

        return createdUser;
    }
}
