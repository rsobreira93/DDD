import { Router } from 'express';
import appointmentRouter from '@modules/appointments/infra/http/routes/Appoiments.routes';
import userRouter from '@modules/users/infra/http/routes/Users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/appointmentes', appointmentRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
export default routes;
