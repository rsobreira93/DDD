import User from '@modules/users/infra/typeorm/entities/User';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private userRepository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already user.');
    }
    const hasedPassowrd = await hash(password, 8);
    const user = await this.userRepository.create({
      name,
      email,
      password: hasedPassowrd,
    });

    return user;
  }
}

export default CreateUserService;
