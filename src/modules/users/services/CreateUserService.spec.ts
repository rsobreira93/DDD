import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from '../services/CrerateUserService';
import FakeHasProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create new user', async () => {
    const fakeHashProvider = new FakeHasProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeHashProvider = new FakeHasProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    expect(
      createUserService.execute({
        name: 'Jonh Doe',
        email: 'jonh@email.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
