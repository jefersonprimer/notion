import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUseCase: LoginUseCase // Injetando a dependência
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
}
