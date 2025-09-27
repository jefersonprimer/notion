import { Router } from 'express';
import { userController } from '../../main/factories/userFactory'; // Importa a instância pronta
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

// Public routes
userRouter.post('/signup', (req, res) => userController.handleCreateUser(req, res));
userRouter.post('/login', (req, res) => userController.handleLogin(req, res));
userRouter.post('/forgot-password', (req, res) => userController.handleForgotPassword(req, res));
userRouter.post('/reset-password', (req, res) => userController.handleResetPassword(req, res));

// Protected routes
userRouter.delete('/me', authMiddleware, (req, res) => userController.delete(req, res));

export { userRouter };
