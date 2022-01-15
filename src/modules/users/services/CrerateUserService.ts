import User from '@modules/users/infra/typeorm/entities/User';
import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository
  ) {}

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
