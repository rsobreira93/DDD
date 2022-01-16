import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private iHashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await this.iHashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { token, user };
  }
}

export default AuthenticateUserService;
