import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CrerateUserService';
import FakeHasProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to Authenticate', async () => {
    const fakeHashProvider = new FakeHasProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    const response = await authenticateUser.execute({
      email: 'jonh@email.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to Authenticate with non existing user', async () => {
    const fakeHashProvider = new FakeHasProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authenticateUser.execute({
        email: 'jonh@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should nont be able to Authenticate with wrong password', async () => {
    const fakeHashProvider = new FakeHasProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    expect(
      authenticateUser.execute({
        email: 'jonh@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
