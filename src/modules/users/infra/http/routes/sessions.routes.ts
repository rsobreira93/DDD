import { Router } from 'express';

import SessioinsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionController = new SessioinsController();

sessionsRouter.post('/', sessionController.create);

export default sessionsRouter;
