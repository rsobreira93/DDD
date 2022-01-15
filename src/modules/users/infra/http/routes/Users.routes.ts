import { Router } from 'express';
import CreateUserService from '@modules/users/services/CrerateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { UpdateUserAvatarService } from '@modules/users/services/UpdateUserAvatarService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRespository';

const userRouter = Router();

const upload = multer(uploadConfig);

userRouter.post('/', async (request, response) => {
  const usersRepository = new UsersRepository();
  const { name, email, password } = request.body;
  const createUser = new CreateUserService(usersRepository);
  const user = await createUser.execute({
    name,
    email,
    password,
  });
  return response.json(user);
});

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateAvatar = new UpdateUserAvatarService(usersRepository);
    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file?.filename as string,
    });
    return response.json(user);
  }
);

export default userRouter;
