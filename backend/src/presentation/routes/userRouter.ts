import { Router } from 'express';
import { userController } from '../../main/factories/userFactory'; // Importa a instância pronta

const userRouter = Router();

userRouter.post('/signup', (req, res) => userController.handleCreateUser(req, res));
userRouter.post('/login', (req, res) => userController.handleLogin(req, res));

export { userRouter };
