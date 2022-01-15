import User from '@modules/users/infra/typeorm/entities/User';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  constructor(private userRepository: IUsersRepository) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const avatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const avatarExists = await fs.promises.stat(avatarFilePath);

      if (avatarExists) {
        await fs.promises.unlink(avatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await this.userRepository.save(user);

    return user;
  }
}

export { UpdateUserAvatarService };
