import { Request, Response } from 'express';
import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

export default class SessioinsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticateUserService = container.resolve(AuthenticateUserService);
    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });
    return response.json({ token, user });
  }
}
