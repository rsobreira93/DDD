import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UplodUserAvatarService from './UpdateUserAvatarService';
import FakeStoregeProvider from '@shared/container/providers/StoregeProvider/fakes/FakeStoregeProvider';

describe('UpdateUserAvatar', () => {
  it('should be able updatet new avatar', async () => {
    const fakeStoregeProvider = new FakeStoregeProvider();

    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatarService = new UplodUserAvatarService(
      fakeUsersRepository,
      fakeStoregeProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able update new avatar from non existing user', async () => {
    const fakeStoregeProvider = new FakeStoregeProvider();

    const fakeUsersRepository = new FakeUsersRepository();
    const updateUserAvatarService = new UplodUserAvatarService(
      fakeUsersRepository,
      fakeStoregeProvider
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existinig-user',
        avatarFilename: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new avatar', async () => {
    const fakeStoregeProvider = new FakeStoregeProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const deleteFile = jest.spyOn(fakeStoregeProvider, 'deleteFile');

    const updateUserAvatarService = new UplodUserAvatarService(
      fakeUsersRepository,
      fakeStoregeProvider
    );

    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@email.com',
      password: '1234',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
