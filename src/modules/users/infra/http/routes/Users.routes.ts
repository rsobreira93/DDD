import { Router } from 'express';
import CreateUserService from '@modules/users/services/CrerateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { UpdateUserAvatarService } from '@modules/users/services/UpdateUserAvatarService';

const userRouter = Router();

const upload = multer(uploadConfig);

userRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();
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
    const updateAvatar = new UpdateUserAvatarService();
    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file?.filename as string,
    });
    return response.json(user);
  }
);

export default userRouter;
