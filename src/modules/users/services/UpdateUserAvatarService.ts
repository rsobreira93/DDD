import { inject, injectable } from 'tsyringe';
import * as path from 'path';
import * as fs from 'fs';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStoreProvider from '@shared/container/providers/StoregeProvider/models/IStoregeProvider';
interface IRequest {
  user_id: string;
  avatarFilename: string;
}
@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('StoregeProvider')
    private storegeProvider: IStoreProvider
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storegeProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storegeProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
