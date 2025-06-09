import { faker } from '@faker-js/faker';
import { CreateUserUseCase } from './create-user';

describe('Create User Use Case', () => {
    class CreateUserRepositoryStub {
        async execute(createUserParams) {
            return {
                id: createUserParams.id,
                email: createUserParams.email,
                first_name: createUserParams.first_name,
                last_name: createUserParams.last_name,
                password: createUserParams.password,
            };
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class PasswordHasherAdapterStub {
        async execute(password) {
            return `hashed_${password}`;
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id';
        }
    }

    const makeSut = () => {
        const createUserRepository = new CreateUserRepositoryStub();
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();

        const createUserUseCase = new CreateUserUseCase(
            createUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        );

        return {
            createUserUseCase,
            createUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        };
    };

    it('should create a user successfully', async () => {
        const { createUserUseCase } = makeSut();

        const createUserParams = {
            email: faker.internet.email(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            password: faker.internet.password({ length: 6 }),
        };

        const result = await createUserUseCase.execute(createUserParams);

        expect(result).toBeTruthy();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty(
            'password',
            `hashed_${createUserParams.password}`,
        );
        expect(result).toEqual({
            ...createUserParams,
            id: 'generated_id',
            password: `hashed_${createUserParams.password}`,
        });
    });
});
