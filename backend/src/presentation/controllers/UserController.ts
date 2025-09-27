import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { LoginUserCase } from '../../application/use-cases/LoginUserCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/ResetPasswordUseCase';
import { DeleteUserUseCase } from '../../application/use-cases/DeleteUserUseCase';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUseCase: LoginUserCase, // Injetando a dependência
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  // handleCreateUser(...) continua o mesmo
  async handleCreateUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const output = await this.createUserUseCase.execute({ email, password });
      return res.status(201).json(output);

    } catch (error: any) {
      // Se o erro for "User already registered", o Supabase nos dará um erro específico.
      return res.status(409).json({ message: error.message || "An unexpected error occurred." });
    }
  }

  async handleLogin(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const output = await this.loginUseCase.execute({ email, password });
      return res.status(200).json(output);

    } catch (error: any) {
      // O erro "Invalid email or password" virá do nosso caso de uso
      return res.status(401).json({ message: error.message || "Authentication failed." });
    }
  }

  async handleForgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      await this.forgotPasswordUseCase.execute(email);

      // Retorne sempre uma resposta de sucesso para não revelar se um e-mail existe ou não no sistema.
      return res.status(200).json({ message: "If an account with this email exists, a password reset link has been sent." });

    } catch (error: any) {
      // Mesmo em caso de erro, não revele informações. O erro real deve ser logado no servidor.
      console.error('Forgot Password Error:', error);
      return res.status(200).json({ message: "If an account with this email exists, a password reset link has been sent." });
    }
  }

  async handleResetPassword(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    try {
      await this.resetPasswordUseCase.execute(token, password);
      return res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Could not reset password." });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      await this.deleteUserUseCase.execute(userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Could not delete user account." });
    }
  }
}
